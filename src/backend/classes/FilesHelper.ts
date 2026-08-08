import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { logger } from "@src/backend/utils/logger";
import { TGameId } from "@src/backend/types/gameConfigData.type";

/** Helper class for managing files and file paths */
export class FilesHelper {
  /**
   * Helper function for referencing config files location
   * between dev and prod
   */
  static configFilePath(devEnv: boolean, fileLocation: string) {
    if (devEnv) {
      return path.resolve(__dirname, "../../src/backend/config", fileLocation);
    }

    return path.resolve(process.resourcesPath, "config", fileLocation);
  }

  /**
   * Copy file from one place to another
   */
  static async copyFile(source: string, dest: string) {
    return new Promise<void>((resolve, reject) => {
      const fileName = path.basename(source);
      const readStream = fs.createReadStream(source);
      const writeStream = fs.createWriteStream(path.resolve(dest, fileName));

      readStream.on("error", reject);
      writeStream.on("error", reject);
      writeStream.on("close", resolve);

      readStream.pipe(writeStream);
    });
  }

  /**
   * Copy an entire folder from one place to another
   */
  static async copyFolder(source: string, dest: string) {
    return fs.promises.cp(source, dest, { recursive: true });
  }

  /**
   * Move everything from one folder to another
   * @param removeAfterMove Remove the `from` folder when finished
   */
  static async moveAll(from: string, to: string, removeAfterMove: boolean = false): Promise<void> {
    const files = await fs.promises.readdir(from, { recursive: true, withFileTypes: true }).then((res) => {
      return res.filter((item) => item.isFile());
    });

    const renameItemsCollector: Promise<void>[] = [];

    files.forEach(async (file) => {
      const relativePath = path.relative(from, file.parentPath);
      const newFileLocation = path.resolve(to, relativePath);
      const newFilePath = path.join(to, relativePath, file.name);
      const oldFilePath = path.join(from, relativePath, file.name);

      if (!fs.existsSync(newFileLocation)) {
        fs.mkdirSync(newFileLocation, { recursive: true });
      }

      // Check if the overwrite file exists and remove it
      if (fs.existsSync(newFilePath)) {
        await fs.promises.rm(newFilePath, { force: true, maxRetries: 5, retryDelay: 500 });
        logger.info(`Removed: ${newFilePath}`);
      }

      renameItemsCollector.push(
        fs.promises
          .rename(oldFilePath, newFilePath)
          .then(() => logger.info(`File moved: ${oldFilePath} -> ${newFileLocation}`)),
      );
    });

    await Promise.all(renameItemsCollector);

    if (removeAfterMove) {
      FilesHelper.remove(from);
    }
  }

  /**
   * Remove file/folder if it exists
   */
  static async remove(path: string) {
    if (fs.existsSync(path)) {
      return fs.promises.rm(path, { force: true, recursive: true, maxRetries: 5, retryDelay: 100 });
    }

    return Promise.resolve();
  }

  /**
   * List all files inside the game directory and leave only the `install_files` folder
   */
  static async removeOldFiles(gamePath: string) {
    if (!fs.existsSync(gamePath)) {
      logger.info(`Folder doesn't exist, skip cleanup: ${gamePath}`);
      return Promise.resolve();
    }

    const files = await fs.promises
      .readdir(gamePath)
      .then((items) => items.filter((item) => item !== "install_files"))
      .then((items) => items.map((item) => path.resolve(gamePath, item)));

    return Promise.all(files.map(FilesHelper.remove));
  }

  /**
   * Returns a list of screenshot paths, each game stores them in different places
   */
  static getAllScreenshotsForGame(gameId: TGameId, directory: string): string[] {
    /**
     * Helper function for mapping images' paths and excluding unwanted images
     */
    function mapScreenshots(screenshotsPath: string, excludeImages: string[] = []): string[] {
      if (!fs.existsSync(screenshotsPath)) {
        return [];
      }

      const validExtensions = [".bmp", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];

      const files = fs.readdirSync(screenshotsPath).filter((file) => {
        return !excludeImages.includes(file) && validExtensions.includes(path.extname(file));
      });

      return files.map((item) => path.resolve(screenshotsPath, item)).reverse();
    }

    switch (gameId) {
      case "unreal": {
        const screenshotsPath = path.resolve(directory, gameId, "System64/Screenshots");
        return mapScreenshots(screenshotsPath);
      }

      case "unreal-2": {
        // Unreal 2 has two instances so we'll need to pull from both folders
        // Shot00000.bmp
        const screenshotsPathSP = path.resolve(directory, gameId, "singleplayer/System");
        const screenshotsPathMP = path.resolve(directory, gameId, "multiplayer/SYSTEM");

        return [...mapScreenshots(screenshotsPathSP), ...mapScreenshots(screenshotsPathMP)];
      }

      case "ut-1999": {
        const screenshotsPath = path.resolve(directory, gameId, "System/Screenshots");
        return mapScreenshots(screenshotsPath);
      }

      case "ut-2003": {
        const screenshotsPath = path.resolve(directory, gameId, "System");
        return mapScreenshots(screenshotsPath, ["edsplash.bmp"]);
      }

      case "ut-2004": {
        const screenshotsPath = path.resolve(directory, gameId, "ScreenShots");
        return mapScreenshots(screenshotsPath);
      }

      case "ut-3": {
        const screenshotsPath = path.resolve(
          os.homedir(),
          "Documents/My Games/Unreal Tournament 3/UTGame/ScreenShots",
        );

        return mapScreenshots(screenshotsPath);
      }

      case "ut-alpha": {
        const screenshotsPath = path.resolve(
          os.homedir(),
          "Documents/UnrealTournament/Saved/Screenshots/WindowsNoEditor",
        );

        return mapScreenshots(screenshotsPath);
      }

      default:
        throw new Error(`Can't get screenshots for provided game id: ${gameId}`);
    }
  }
}
