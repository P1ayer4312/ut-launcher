import path from "node:path";
import axios from "axios";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import type { DownloadManager, GithubReleases, LogsCallback } from "@src/backend/classes/DownloadManger";

/**
 * Download UT4 Alpha, patch, extract and configure
 */
export async function downloadUT4AlphaWindows(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  const links = WorkerHelper.getGameLinks("ut-alpha");
  let latestPatchUrl: string | null;

  if (!links.patch) {
    throw new Error(`"patch" link not provided for: ut-alpha`);
  }

  if (WorkerHelper.isDev()) {
    // Use local download for testing
    dl.setUrls([links.gameFiles, links.patch]);
    latestPatchUrl = links.patch;
  } else {
    // Fetch Github releases from OldUnreal's repo
    const githubReleases = await axios.get<GithubReleases>(links.patch).then((res) => res.data);

    // Find the patch for Windows x86
    latestPatchUrl =
      githubReleases[0].assets.find((item) => {
        const name = item.name.toLowerCase();
        return name.startsWith("UT4UU") && name.endsWith("zip");
      })?.browser_download_url || null;

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

  // Extract game files in the install folder
  await ArchiveManager.extractFiles(
    dl.getFileLocationFromUrl(links.gameFiles),
    dl.installFilesFolder,
    sevenZipLogsCallback,
  );

  // Extract the patch inside the install folder
  await ArchiveManager.extractFiles(
    dl.getFileLocationFromUrl(latestPatchUrl),
    dl.installFilesFolder,
    sevenZipLogsCallback,
  );

  WorkerHelper.postMessage("progress", { progress: 1 });
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

  // Create screenshots folder
  FilesHelper.createScreenshotsFolder(dl.destination);

  // Update the local store for the installed game and tag it as installed
  WorkerHelper.postMessage("updateLocalGameStore", { gameId: "ut-alpha", installed: true });

  // Stop the worker
  WorkerHelper.exit(0);
}
