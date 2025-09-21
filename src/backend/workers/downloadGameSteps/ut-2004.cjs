/** @import { DownloadManager } from '../../classes/DownloadManger.cjs*/
const { WorkerHelper } = require("../../classes/WorkerHelper.cjs");
const { ArchiveManager } = require("../../classes/ArchiveManager.cjs");
const { FilesHelper } = require("../../classes/FilesHelper.cjs");
const path = require("node:path");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");

/**
 * Download UT2004, extract, configure and move files
 * @param {DownloadManager} dl
 * @param {(value: string) => void} sevenZipLogsCallback
 */
async function downloadUT2004(dl, sevenZipLogsCallback) {
	const links = WorkerHelper.getGameLinks("ut-2004");

	// Download all necessary files
	// eslint-disable-next-line no-async-promise-executor
	await new Promise(async (resolve, reject) => {
		dl.setUrls([links.gameFiles]);

		dl.on("error", reject);
		dl.on("finish", resolve);

		// Start the download
		dl.start();
	});

	// Extract game files
	WorkerHelper.postMessage("progressFormatted", "Extracting files...");

	await ArchiveManager.extractFiles(
		dl.getFileLocationFromUrl(links.gameFiles),
		dl.installFilesFolder,
		sevenZipLogsCallback,
	);

	// Move all extracted files to the game root folder, this step is not needed
	// but it's added to keep game files' structure consistent for each game,
	// also 7zip is a bit limited with how to extract certain files

	WorkerHelper.postMessage("progressFormatted", "Moving files...");

	const extractedFolderPath = path.resolve(dl.installFilesFolder, "UT2004");
	const files = await fs.readdir(extractedFolderPath);

	await Promise.all(
		files.map((item) => {
			const oldPath = path.resolve(extractedFolderPath, item);
			const newPath = path.resolve(dl.destination, item);
			return fs.rename(oldPath, newPath);
		}),
	);

	await fs.rmdir(extractedFolderPath);

	// Create screenshots folder
	const screenshotsFolder = path.resolve(dl.destination, "launcher_screenshots");
	if (fsSync.existsSync(screenshotsFolder)) {
		await fs.mkdir(screenshotsFolder);
	}

	// // Update the local store for the installed game and tag it as installed
	// WorkerHelper.postMessage("updateLocalGameStore", {
	// 	gameId: "ut-2004",
	// 	installed: true,
	// });

	// Stop the worker
	WorkerHelper.exit(0);
}

module.exports = { downloadUT2004 };
