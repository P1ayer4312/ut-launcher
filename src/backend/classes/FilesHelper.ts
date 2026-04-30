import path from "node:path";
import fs from "node:fs";
import { logger } from "@src/backend/utils/logger";

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
    return new Promise((resolve, reject) => {
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
   * Create `launcher_screenshots` folder
   */
  static createScreenshotsFolder(gameFolder: string) {
    const screenshotsFolder = path.resolve(gameFolder, "launcher_screenshots");
    if (!fs.existsSync(screenshotsFolder)) {
      fs.mkdirSync(screenshotsFolder);
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
}
