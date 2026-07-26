import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { fetchGithubReleases } from "@src/backend/utils/fetchGithubReleases";

/**
 * Download UT4 Alpha, patch, extract and configure
 */
export async function downloadUT4AlphaWindows(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  const links = WorkerHelper.getGameLinks("ut-alpha");
  let latestPatchUrl: string | null;

  if (!links.patch) {
    throw new Error(`"patch" link not provided for: ut-alpha`);
  }

  const ut4ConfigDestination = path.resolve(os.homedir(), "Documents/UnrealTournament");

  // Clean up previous files if they exist
  await FilesHelper.removeOldFiles(dl.destination);
  await FilesHelper.remove(ut4ConfigDestination);

  if (WorkerHelper.isDev()) {
    // Use local download for testing
    latestPatchUrl = links.extraFiles[0];
    dl.setUrls([links.gameFiles, latestPatchUrl]);
  } else {
    // Fetch Github releases from OldUnreal's repo
    const githubReleases = await fetchGithubReleases(links.patch);

    // Find the patch for Windows x86
    latestPatchUrl =
      githubReleases[0].find((item) => {
        const name = item.fileName.toLowerCase();
        return name.startsWith("ut4uu") && name.endsWith("zip");
      })?.url || null;

    if (!latestPatchUrl) {
      throw new Error("Unable to find patch");
    }

    dl.setUrls([links.gameFiles, latestPatchUrl]);
  }

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

  // Copy the skip files list next to the game archive
  await FilesHelper.copyFile(
    FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-alpha/skip.txt"),
    dl.installFilesFolder,
  );

  // Extract game files in the install folder
  await ArchiveManager.extractFilesWithIgnore(
    dl.getFileLocationFromUrl(links.gameFiles),
    dl.installFilesFolder,
    "skip.txt",
    sevenZipLogsCallback,
  );

  // Extract the patch inside the install folder
  await ArchiveManager.extractFiles(
    dl.getFileLocationFromUrl(latestPatchUrl),
    dl.installFilesFolder,
    sevenZipLogsCallback,
  );

  WorkerHelper.postMessage("progress", { progress: 2 });
  WorkerHelper.postMessage("progressFormatted", "Moving game files...");

  // Move game files to the game folder
  const extractedGamePath = path.resolve(dl.installFilesFolder, "WindowsNoEditor");
  await FilesHelper.moveAll(extractedGamePath, dl.destination, true);

  // Get the folder name for the patch
  WorkerHelper.postMessage("progressFormatted", "Moving patch files...");
  const patchFolderName = path.basename(latestPatchUrl, path.extname(latestPatchUrl));
  const patchFolderPath = path.resolve(dl.installFilesFolder, patchFolderName);
  const extractedPatchPath = path.resolve(patchFolderPath, "Installer", "Files");

  // Apply the patch to the game folder
  await FilesHelper.moveAll(extractedPatchPath, dl.destination);

  // Clean up unused files
  FilesHelper.remove(patchFolderPath);

  // Copy the config folder inside the "Documents" folder
  const savedConfigPath = path.resolve(ut4ConfigDestination, "Saved");
  await fs.promises.mkdir(savedConfigPath, { recursive: true });
  await FilesHelper.copyFolder(
    FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-alpha/Saved"),
    savedConfigPath,
  );

  // Prompt the user to install drivers
  WorkerHelper.postMessage("openContinueModal", {
    isOpened: true,
    message: null,
    variant: "ut-alpha-install-message",
  });

  // Update the local store for the installed game and tag it as installed
  WorkerHelper.postMessage("updateLocalGameStore", { gameId: "ut-alpha", installed: true });

  // Stop the worker
  WorkerHelper.exit(0);
}
