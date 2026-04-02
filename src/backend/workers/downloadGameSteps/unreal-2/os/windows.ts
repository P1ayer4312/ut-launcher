import path from "node:path";
import axios from "axios";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import type {
  DownloadManager,
  GithubReleases,
  SevenZipLogsCallback,
} from "@src/backend/classes/DownloadManger";

/**
 * Download Unreal 1, patch, extract and configure
 */
export async function downloadUnreal2Windows(
  dl: DownloadManager,
  innoextractLogsCallback: SevenZipLogsCallback,
) {
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

  // Extract the installer
  await ArchiveManager.extractInnoInstaller(
    dl.getFileLocationFromUrl(links.gameFiles),
    dl.destination,
    innoextractLogsCallback,
  );

  // Create screenshots folder
  FilesHelper.createScreenshotsFolder(dl.destination);

  // Update the local store for the installed game and tag it as installed
  WorkerHelper.postMessage("updateLocalGameStore", {
    gameId: "unreal-2",
    installed: true,
  });

  // Stop the worker
  WorkerHelper.exit(0);
}
