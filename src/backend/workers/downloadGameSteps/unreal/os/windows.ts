import path from "node:path";
import axios from "axios";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import type { DownloadManager, GithubReleases, LogsCallback } from "@src/backend/classes/DownloadManger";

/**
 * Download Unreal 1, patch, extract and configure
 */
export async function downloadUnrealWindows(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  const links = WorkerHelper.getGameLinks("unreal");
  let latestPatchUrl: string | null;

  if (!links.patch) {
    throw new Error(`"patch" link not provided for: unreal`);
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
        return name.includes("windows") && name.endsWith("zip") && !name.includes("windowsxp");
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

  // Copy the skip files list next to the game archive
  await FilesHelper.copyFile(
    FilesHelper.configFilePath(WorkerHelper.isDev(), "unreal/skip.txt"),
    dl.installFilesFolder,
  );

  // Extract game files and exclude the ones on the list
  await ArchiveManager.extractFilesWithIgnore(
    dl.getFileLocationFromUrl(links.gameFiles),
    dl.destination,
    "skip.txt",
    sevenZipLogsCallback,
  );

  // Extract the patch in the game folder
  await ArchiveManager.extractFiles(
    dl.getFileLocationFromUrl(latestPatchUrl),
    dl.destination,
    sevenZipLogsCallback,
  );

  // Copy config files in the game folder
  WorkerHelper.postMessage("progressFormatted", "Alter game configuration...");
  const gameSystemFolder = path.resolve(dl.destination, "System64");
  await FilesHelper.copyFile(
    FilesHelper.configFilePath(WorkerHelper.isDev(), "unreal/Unreal.ini"),
    gameSystemFolder,
  );

  // Create screenshots folder
  FilesHelper.createScreenshotsFolder(dl.destination);

  // Update the local store for the installed game and tag it as installed
  WorkerHelper.postMessage("updateLocalGameStore", {
    gameId: "unreal",
    installed: true,
  });

  // Stop the worker
  WorkerHelper.exit(0);
}
