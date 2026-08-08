import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import { IniHelper } from "@src/backend/classes/IniHelper";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Download UT 2003, patch, extract and configure
 */
export async function downloadUT2003Windows(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  const links = WorkerHelper.getGameLinks("ut-2003");

  dl.setUrls([links.gameFiles]);

  // Download all necessary files
  await new Promise((resolve, reject) => {
    dl.on("error", reject);
    dl.on("finish", resolve);

    // Start the download
    dl.start();
  });

  // Start extracting files
  WorkerHelper.postMessage("progressFormatted", "Extracting files...");
  WorkerHelper.postMessage("progress", { progress: 1 });

  // Clean up previous files if they exist
  await FilesHelper.removeOldFiles(dl.destination);

  // Extract game files
  await ArchiveManager.extractFiles(
    dl.getFileLocationFromUrl(links.gameFiles),
    dl.destination,
    sevenZipLogsCallback,
  );

  // Copy config files in the game folder
  WorkerHelper.postMessage("progressFormatted", "Alter game configuration...");

  const gameSystemFolder = path.resolve(dl.destination, "System");
  await Promise.all([
    FilesHelper.copyFile(
      FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-2003/User.ini"),
      gameSystemFolder,
    ),
    FilesHelper.copyFile(
      FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-2003/UT2003.ini"),
      gameSystemFolder,
    ),
  ]);

  // Patch User.ini and set a random user
  const uuid = randomUUID();
  const ini = new IniHelper();
  const userIniPath = path.resolve(gameSystemFolder, "User.ini");
  await ini.readFile(userIniPath);

  ini.setValue("Engine.PlayerController", "StatsUsername", uuid.slice(uuid.lastIndexOf("-") + 1));
  ini.setValue("Engine.PlayerController", "StatsPassword", uuid.slice(0, uuid.indexOf("-")));
  await ini.saveFile();

  // Prompt the user to register a key
  WorkerHelper.postMessage("openContinueModal", {
    isOpened: true,
    message: null,
    variant: "ut-2003-register-key",
  });

  // Update the local store for the installed game and tag it as installed
  WorkerHelper.postMessage("updateLocalGameStore", { gameId: "ut-2003", installed: true });

  // Stop the worker
  WorkerHelper.exit(0);
}
