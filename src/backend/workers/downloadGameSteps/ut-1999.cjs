/** @import DownloadManager from '../../classes/DownloadManger.cjs*/
/** @import { TWorkerData } from '../../types/gameConfigData.cjs' */
const { parentPort, workerData: _workerData } = require("node:worker_threads");
const path = require("node:path");
const fs = require("node:fs");
const ArchiveManager = require("../../classes/ArchiveManager.cjs");
const linksProvider = require("../../providers/linksProvider.cjs");
const Helper = require("../../classes/Helper.cjs");
const axios = require("axios");

/** @type {TWorkerData} */
const workerData = _workerData;

/**
 * Download UT1999, patch, extract and configure
 * @param {DownloadManager} dl
 * @param {(value: string) => void} sevenZipLogsCallback
 */
async function downloadUT1999(dl, sevenZipLogsCallback) {
	let latestPatchUrl;
	const links = process.env.DEV ? linksProvider["ut-1999"].dev : linksProvider["ut-1999"].prod;
	dl.setDownloadDestination(workerData.installDirectory, workerData.gameId);

	// Download all necessary files
	await new Promise(async (resolve, reject) => {
		if (process.env.DEV) {
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

			// TODO: Fix error handling
			if (!latestPatchUrl) {
				console.error("Unable to find patch");
			}

			dl.setUrls([links.gameFiles, latestPatchUrl]);
		}

		dl.on("error", (err) => reject(err));
		dl.on("finish", () => resolve());

		// Start the download
		dl.start();
	});

	// Start extracting files
	parentPort.postMessage({ key: "progressFormatted", value: "Extracting files..." });
	parentPort.postMessage({ key: "progress", value: { progress: 1 } });

	// Copy the skip files list next to the game archive
	await Helper.copyFile(Helper.configFilePath(process.env.DEV, "ut-1999/skip.txt"), dl.installFilesFolder);

	// Extract game files and exclude the ones on the list
	await ArchiveManager.extractFilesWithIgnore(
		dl.getFileLocationFromUrl(links.gameFiles),
		dl.destination,
		"skip.txt",
		sevenZipLogsCallback
	);

	// Extract the patch in the game folder
	await ArchiveManager.extractFiles(
		dl.getFileLocationFromUrl(latestPatchUrl),
		dl.destination,
		sevenZipLogsCallback
	);

	// Copy config files in the game folder
	parentPort.postMessage({ key: "progressFormatted", value: "Alter game configuration..." });
	const gameSystemFolder = path.resolve(dl.destination, "System");
	await Promise.all([
		Helper.copyFile(Helper.configFilePath(process.env.DEV, "ut-1999/UnrealTournament.ini"), gameSystemFolder),
		Helper.copyFile(Helper.configFilePath(process.env.DEV, "ut-1999/User.ini"), gameSystemFolder),
	]);

	// Create screenshots folder
	const screenshotsFolder = path.resolve(dl.destination, "launcher_screenshots");
	if (!fs.existsSync(screenshotsFolder)) {
		fs.mkdirSync(screenshotsFolder);
	}

	// Update the local store for the installed game
	parentPort.postMessage({
		key: "updateLocalGameStore",
		value: { gameId: "ut-1999", installed: true },
	});

	// Stop the worker
	process.exit(0);
}

module.exports = downloadUT1999;
