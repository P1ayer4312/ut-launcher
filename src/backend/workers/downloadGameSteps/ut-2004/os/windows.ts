import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import { IniHelper } from "@src/backend/classes/IniHelper";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Download UT 2004, patch, extract and configure
 */
export async function downloadUT2004Windows(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  const links = WorkerHelper.getGameLinks("ut-2004");

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

  // Extract game files in the install folder
  await ArchiveManager.extractFiles(
    dl.getFileLocationFromUrl(links.gameFiles),
    dl.installFilesFolder,
    sevenZipLogsCallback,
  );

  WorkerHelper.postMessage("progress", { progress: 2 });
  WorkerHelper.postMessage("progressFormatted", "Moving game files...");

  // Move game files to the game folder
  const extractedGamePath = path.resolve(dl.installFilesFolder, "UT2004");
  await FilesHelper.moveAll(extractedGamePath, dl.destination, true);
  await FilesHelper.remove(extractedGamePath);

  // Copy config files in the game folder
  WorkerHelper.postMessage("progressFormatted", "Alter game configuration...");

  const gameSystemFolder = path.resolve(dl.destination, "System");
  await Promise.all([
    FilesHelper.copyFile(
      FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-2004/User.ini"),
      gameSystemFolder,
    ),
    FilesHelper.copyFile(
      FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-2004/UT2004.ini"),
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
  ini.setValue("Engine.PlayerController", "bEnableStatsTracking", "True");
  await ini.saveFile();

  // Notify the user for additional options
  WorkerHelper.postMessage("openContinueModal", {
    isOpened: true,
    message: null,
    variant: "ut-2004-install-message",
  });

  // Update the local store for the installed game and tag it as installed
  WorkerHelper.postMessage("updateLocalGameStore", { gameId: "ut-2004", installed: true });

  // Stop the worker
  WorkerHelper.exit(0);
}
