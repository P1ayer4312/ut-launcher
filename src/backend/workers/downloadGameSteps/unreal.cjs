/** @import { DownloadManager } from '../../classes/DownloadManger.cjs*/
const path = require("node:path");
const fs = require("node:fs");
const { ArchiveManager } = require("../../classes/ArchiveManager.cjs");
const axios = require("axios");
const { FilesHelper } = require("../../classes/FilesHelper.cjs");
const { WorkerHelper } = require("../../classes/WorkerHelper.cjs");

/**
 * Download UT1999, patch, extract and configure
 * @param {DownloadManager} dl
 * @param {(value: string) => void} sevenZipLogsCallback
 */
async function downloadUnreal(dl, sevenZipLogsCallback) {
	let latestPatchUrl;
	const links = WorkerHelper.getGameLinks("unreal");

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
				const name = item.name.toLowerCase();
				return name.includes("windows") && name.endsWith("zip") && !name.includes("windowsxp");
			})?.browser_download_url;

			if (!latestPatchUrl) {
				throw new Error("Unable to find patch");
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
	const screenshotsFolder = path.resolve(dl.destination, "launcher_screenshots");
	if (!fs.existsSync(screenshotsFolder)) {
		fs.mkdirSync(screenshotsFolder);
	}

	// Update the local store for the installed game and tag it as installed
	WorkerHelper.postMessage("updateLocalGameStore", {
		gameId: "unreal",
		installed: true,
	});

	// Stop the worker
	WorkerHelper.exit(0);
}

module.exports = { downloadUnreal };
