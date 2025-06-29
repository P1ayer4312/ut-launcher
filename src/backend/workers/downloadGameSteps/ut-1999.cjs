/** @import DownloadManager from '../../classes/DownloadManger.cjs*/
/** @import { TWorkerData } from '../../types/gameConfigData.cjs' */
const { parentPort, workerData: _workerData } = require("node:worker_threads");
const ArchiveManager = require("../../classes/ArchiveManager.cjs");
const linksProvider = require("../../providers/linksProvider.cjs");
const fs = require("node:fs/promises");

/** @type {TWorkerData} */
const workerData = _workerData;

/**
 * Download UT1999, patch, extract and configure
 * @param {DownloadManager} dl
 * @param {(value: string) => void} sevenZipLogsCallback
 */
async function downloadUT1999(dl, sevenZipLogsCallback) {
	const isDev = Boolean(process.env.DEV);
	const links = isDev ? linksProvider["ut-1999"].dev : linksProvider["ut-1999"].prod;

	dl.setDownloadDestination(workerData.installDirectory, workerData.gameId);

	// Download all necessary files
	await new Promise(async (resolve, reject) => {
		if (isDev) {
			// Use local download for testing
			dl.setUrls(Object.values(links));
		} else {
			// Fetch Github releases from OldUnreal's repo
			const githubReleases = await axios.get(links.patch).then((res) => res.data);

			// Find the patch for Windows x86
			const latestPatchUrl = githubReleases[0].assets.find((item) => {
				const name = item.name.toLowerCase();
				return name.includes("windows") && name.endsWith("zip") && !name.includes("windowsxp");
			})?.browser_download_url;

			// TODO: Fix error handling
			if (!latestPatchUrl) {
				console.error("Unable to find patch");
			}

			dl.setUrls([links.gameFiles, links.installer, latestPatchUrl]);
		}

		dl.on("error", (err) => reject(err));
		dl.on("finish", () => resolve());

		// Start the download
		dl.start();
	});

	// Start extracting files
	parentPort.postMessage({ key: "progressFormatted", value: "Extracting files..." });
	parentPort.postMessage({ key: "progress", value: { progress: 1 } });

	// Unpack the installer provided from OldUnreal, unpack the zip, then the exe
	await ArchiveManager.extractFiles(
		dl.getFileLocationFromUrl(links.installer),
		dl.installFilesFolder,
		sevenZipLogsCallback
	);

	// Find the executable name (it should be the same but just in case)
	// Then extract it in the install_folder
	const exeName = await fs
		.readdir(dl.installFilesFolder)
		.then((res) => res.find((item) => item.endsWith("exe")));

	const exeInstallerPath = dl.getFileLocationForFile(exeName);
	await ArchiveManager.extractFiles(exeInstallerPath, dl.installFilesFolder, sevenZipLogsCallback);

	// Patch the skip.txt file
	let skipList = await fs.readFile(dl.getFileLocationForFile("Installer/skip.txt"), { encoding: "utf-8" });
	skipList += `\nSetup.exe`;
	await fs.writeFile(dl.getFileLocationForFile("skip.txt"), skipList, { encoding: "utf-8" });

	// Extract game files and exclude the ones on the list
	await ArchiveManager.extractFilesWithIgnore(
		dl.getFileLocationFromUrl(links.gameFiles),
		dl.destination,
		"skip.txt",
		sevenZipLogsCallback
	);
}

module.exports = downloadUT1999;
