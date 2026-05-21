import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import * as path from "node:path";

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
  // prettier-ignore
  const gameFiles = [
    "Animations", "AutoRun.inf", "Benchmark", "DirectX8", "Extras", "ForceFeedback",
    "Help", "KarmaData", "Maps", "Music", "Setup.exe", "Sounds", "StaticMeshes",
    "System", "Textures", "Web", "linux_installer.sh"
  ];

  for (const item of gameFiles) {
    await FilesHelper.remove(path.resolve(dl.destination, item));
  }

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
