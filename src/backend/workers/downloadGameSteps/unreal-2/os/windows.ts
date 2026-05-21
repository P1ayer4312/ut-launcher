import path from "node:path";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";

/**
 * Download Unreal 2, patch, extract and configure
 */
export async function downloadUnreal2Windows(dl: DownloadManager, innoextractLogsCallback: LogsCallback) {
  const links = WorkerHelper.getGameLinks("unreal-2");

  // Download all necessary files
  dl.setUrls([links.gameFiles]);

  await new Promise((resolve, reject) => {
    dl.on("error", reject);
    dl.on("finish", resolve);

    // Start the download
    dl.start();
  });

  WorkerHelper.postMessage("progressFormatted", "Extracting files...");
  WorkerHelper.postMessage("progress", { progress: 1 });

  // Clean up previous files if they exist
  // prettier-ignore
  const gameFiles = [
    "__redist", "__support", "app", "commonappdata", "goggame-1207658677.hashdb",
    "goggame-1207658677.ico", "goggame-1207658677.info", "goggame-1207658677.script",
    "goggame.sdb", "multiplayer", "singleplayer", "tmp"
  ];

  for (const item of gameFiles) {
    await FilesHelper.remove(path.resolve(dl.destination, item));
  }

  // Extract the installer
  await ArchiveManager.extractInnoInstaller(
    dl.getFileLocationFromUrl(links.gameFiles),
    dl.destination,
    innoextractLogsCallback,
  );

  // Copy config files in the games' folders
  WorkerHelper.postMessage("progressFormatted", "Alter game configuration...");

  const singleplayerFolder = path.resolve(dl.destination, "singleplayer/System");
  const multiplayerFolder = path.resolve(dl.destination, "multiplayer/SYSTEM");
  await Promise.all([
    FilesHelper.copyFile(
      FilesHelper.configFilePath(WorkerHelper.isDev(), "unreal-2/singleplayer/System/User.ini"),
      singleplayerFolder,
    ),
    FilesHelper.copyFile(
      FilesHelper.configFilePath(WorkerHelper.isDev(), "unreal-2/singleplayer/System/Unreal2.ini"),
      singleplayerFolder,
    ),
    FilesHelper.copyFile(
      FilesHelper.configFilePath(WorkerHelper.isDev(), "unreal-2/multiplayer/system/User.ini"),
      multiplayerFolder,
    ),
    FilesHelper.copyFile(
      FilesHelper.configFilePath(WorkerHelper.isDev(), "unreal-2/multiplayer/system/MyU2XMP.ini"),
      multiplayerFolder,
    ),
  ]);

  // Update the local store for the installed game and tag it as installed
  WorkerHelper.postMessage("updateLocalGameStore", {
    gameId: "unreal-2",
    installed: true,
  });

  // Stop the worker
  WorkerHelper.exit(0);
}
