import path from "node:path";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { fetchGithubReleases } from "@src/backend/utils/fetchGithubReleases";

/**
 * Download UT1999, patch, extract and configure
 */
export async function downloadUT1999Windows(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  const links = WorkerHelper.getGameLinks("ut-1999");
  let latestPatchUrl: string | null;

  if (!links.patch) {
    throw new Error(`"patch" link not provided for: ut-1999`);
  }

  if (WorkerHelper.isDev()) {
    // Use local download for testing
    latestPatchUrl = links.extraFiles[0];
    dl.setUrls([links.gameFiles, latestPatchUrl]);
  } else {
    // Fetch Github releases from OldUnreal's repo
    const githubReleases = await fetchGithubReleases(links.patch);

    // Find the patch for Windows
    latestPatchUrl =
      githubReleases[0].find((item) => {
        const name = item.fileName.toLowerCase();
        return name.includes("windows") && name.endsWith("zip") && !name.includes("windowsxp");
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

  // Clean up previous files if they exist
  // prettier-ignore
  const gameFiles = [
    "LICENSE.md", "NetGamesUSA.com", "ReleaseNotes.md", "Web", "Help", "Logs",
    "Maps", "Music", "Sounds", "System", "Textures", "SystemLocalized",
  ];

  for (const item of gameFiles) {
    await FilesHelper.remove(path.resolve(dl.destination, item));
  }

  // Copy the skip files list next to the game archive
  await FilesHelper.copyFile(
    FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-1999/skip.txt"),
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

  const gameSystemFolder = path.resolve(dl.destination, "System");
  await Promise.all([
    FilesHelper.copyFile(
      FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-1999/UnrealTournament.ini"),
      gameSystemFolder,
    ),
    FilesHelper.copyFile(
      FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-1999/User.ini"),
      gameSystemFolder,
    ),
  ]);

  // Update the local store for the installed game and tag it as installed
  WorkerHelper.postMessage("updateLocalGameStore", {
    gameId: "ut-1999",
    installed: true,
  });

  // Stop the worker
  WorkerHelper.exit(0);
}
