/** @import { DownloadManager } from '../../classes/DownloadManger.cjs*/
const path = require("node:path");
const { ArchiveManager } = require("../../classes/ArchiveManager.cjs");
const axios = require("axios");
const { FilesHelper } = require("../../classes/FilesHelper.cjs");
const { WorkerHelper } = require("../../classes/WorkerHelper.cjs");

/**
 * Download UT2004, extract, configure and move files
 * @param {DownloadManager} dl
 * @param {(value: string) => void} sevenZipLogsCallback
 */
async function downloadUT4Alpha(dl, sevenZipLogsCallback) {
	let latestPatchUrl;
	const links = WorkerHelper.getGameLinks("ut-alpha");

	// Download all necessary files
	// eslint-disable-next-line no-async-promise-executor
	await new Promise(async (resolve, reject) => {
		if (WorkerHelper.isDev()) {
			// Use local download for testing
			dl.setUrls([links.gameFiles, links.patch]);
			latestPatchUrl = links.patch;
		} else {
			// Fetch Github releases from OldUnreal's repo
			const githubReleases = await axios.get(links.patch).then((res) => res.data);

			// Find the patch for Windows x86
			latestPatchUrl = githubReleases[0].assets.find((item) => {
				// TODO: Replace this part with correct values
				const name = item.name.toLowerCase();
				return name.includes("windows") && name.endsWith("zip") && !name.includes("windowsxp");
			})?.browser_download_url;

			// TODO: Fix error handling
			if (!latestPatchUrl) {
				console.error("Unable to find patch");
			}

			dl.setUrls([links.gameFiles, latestPatchUrl]);
		}

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
	// TODO: Switch this everywhere
	// const screenshotsFolder = path.resolve(dl.destination, "launcher_screenshots");
	// if (!fs.existsSync(screenshotsFolder)) {
	// 	fs.mkdirSync(screenshotsFolder);
	// }
	FilesHelper.createScreenshotsFolder(dl.destination);

	// Update the local store for the installed game and tag it as installed
	WorkerHelper.postMessage("updateLocalGameStore", { gameId: "ut-alpha", installed: true });

	// Stop the worker
	WorkerHelper.exit(0);
}

module.exports = { downloadUT4Alpha };
