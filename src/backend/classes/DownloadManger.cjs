const { default: axios } = require("axios");
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const path = require("node:path");

/**
 * @extends {EventEmitter<{
 * "start": [boolean],
 * "progress": [axios.AxiosProgressEvent],
 * "progressFormatted": [string],
 * "error": [any],
 * "finish": [boolean],
 * "stop": [boolean]
 * }>}
 */
class DownloadManager extends EventEmitter {
	/**
	 * Create download instance, use the `start()` function to
	 * begin downloading, `stop()` for terminating the download
	 */
	constructor() {
		super();
		/** @type {string[]} */
		this.urls = [];
		this.urlCounter = 0;
		/** The location where the game will be installed */
		this.destination = "";
		this.abortController = null;
		this.fileName = "";
		/** The `install_files` folder where the game files and patches are downloaded */
		this.installFilesFolder = "";
	}

	/**
	 * Provide an array of urls to download
	 * @param {string[]} urls
	 */
	setUrls(urls) {
		this.urls = urls;
	}

	/**
	 * Define where to install the game and download the files
	 * @param {string} destination
	 * @param {string} gameFolderName
	 */
	setDownloadDestination(destination, gameFolderName = "") {
		const folderPath = path.resolve(destination, gameFolderName);
		this.destination = folderPath;
		this.installFilesFolder = path.resolve(this.destination, "install_files");
	}

	/** Start the download process */

	start() {
		const url = this.urls[this.urlCounter];
		this.fileName = decodeURI(path.basename(url));
		this.abortController = new AbortController();
		const installFilesFullPath = path.resolve(this.installFilesFolder, this.fileName);

		if (!fs.existsSync(this.destination)) {
			fs.mkdirSync(this.destination);
			fs.mkdirSync(this.installFilesFolder);
		}

		if (fs.existsSync(installFilesFullPath)) {
			// Skip existing files
			return this.checkNextDownload();
		}

		this.emit("start", true);

		axios
			.get(url, {
				onDownloadProgress: (progressEvent) => {
					this.emit("progress", progressEvent);
					this.emit("progressFormatted", formatDownloadProgress(progressEvent, this.fileName));
				},
				responseType: "stream",
				signal: this.abortController.signal,
			})
			.then((response) => {
				const pipe = response.data.pipe(fs.createWriteStream(installFilesFullPath));
				pipe.on("finish", () => this.checkNextDownload());
			})
			.catch((err) => {
				const msg = `Error while trying to download: ${url}`;
				// eslint-disable-next-line no-console
				console.error(msg, err);
				this.emit("error", msg);
			});
	}

	/** @private */
	checkNextDownload() {
		this.urlCounter += 1;
		if (this.urlCounter >= this.urls.length) {
			// All urls are downloaded
			this.emit("finish", true);
		} else {
			// Start the next download
			this.start();
		}
	}

	/** Stop the download process */
	stop() {
		this.abortController?.abort();
		// TODO: Return this after testing
		// fs.rmSync(this.destination, { recursive: true, force: true });
		this.emit("stop", true);
	}

	/**
	 * Helper function that combines the download destination path with a file taken from url
	 * @param {string} url
	 */
	getFileLocationFromUrl(url) {
		const fileName = decodeURI(path.basename(url));
		return path.resolve(this.installFilesFolder, fileName);
	}

	/**
	 * Helper function for getting a file path for a given file name inside the download destination path
	 * @param {string} fileName
	 */
	getFileLocationForFile(fileName) {
		return path.resolve(this.installFilesFolder, fileName);
	}
}

function formatDownloadProgress(info, fileName) {
	const formatBytes = (bytes) => {
		if (bytes === 0) return "0B";
		const sizes = ["B", "KB", "MB", "GB", "TB"];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${(bytes / Math.pow(1024, i)).toFixed(1)}${sizes[i]}`;
	};

	const formatRate = (bytesPerSec) => {
		return bytesPerSec ? `${formatBytes(bytesPerSec)}/s` : "";
	};

	const formatEstimated = (seconds) => {
		if (seconds === 0) return "done";
		if (!seconds || !isFinite(seconds)) return "";

		const totalSec = Math.round(seconds);
		const minutes = Math.floor(totalSec / 60);
		const sec = totalSec % 60;
		const time = minutes > 0 ? `${minutes} minute(s)` : `${sec} second(s)`;
		return `estimate: ${time}`;
	};

	const downloaded = formatBytes(info.loaded);
	const total = formatBytes(info.total);
	const speed = formatRate(info.rate);
	const eta = formatEstimated(info.estimated);

	return `${downloaded}/${total} ${speed} ${eta} - ${fileName}`;
}

module.exports = { DownloadManager };
