import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import path from "node:path";

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
  // prettier-ignore
  const gameFiles = [
    "Animations", "Cache", "ForceFeedback", "Help", "KarmaData", "Maps", "Music",
    "Readme.txt", "Sounds", "Speech", "StaticMeshes", "System", "SystemARM64",
    "SystemLocalized", "Textures", "UT2004.reg", "UT2KxRegCheck10-README.TXT",
    "ScreenShots", "UT2KxRegCheck10.exe", "UserLogs", "Web"
  ];

  for (const item of gameFiles) {
    await FilesHelper.remove(path.resolve(dl.destination, item));
  }

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
