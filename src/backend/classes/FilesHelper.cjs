const path = require("node:path");
const fs = require("node:fs");
const fsPromise = require("node:fs/promises");

/** Helper class for managing files and file paths */
class FilesHelper {
	/**
	 * Helper function for referencing config files location
	 * between dev and prod
	 * @param {boolean} devEnv
	 * @param {string} fileLocation
	 */
	static configFilePath(devEnv, fileLocation) {
		if (devEnv) {
			return path.resolve(__dirname, "../config", fileLocation);
		}

		return path.resolve(process.resourcesPath, "config", fileLocation);
	}

	/**
	 * Copy file from one place to another
	 * @param {string} source
	 * @param {string} dest
	 */
	static async copyFile(source, dest) {
		return new Promise((resolve, reject) => {
			const fileName = path.basename(source);
			const readStream = fs.createReadStream(source);
			const writeStream = fs.createWriteStream(path.resolve(dest, fileName));

			readStream.on("error", reject);
			writeStream.on("error", reject);
			writeStream.on("close", resolve);

			readStream.pipe(writeStream);
		});
	}

	/**
	 * Move everything from one folder to another
	 * @param {string} from
	 * @param {string} to
	 * @param {boolean} removeAfterMove Remove the `from` folder when finished
	 * @returns {Promise<void>}
	 */
	static async moveAll(from, to, removeAfterMove = false) {
		const files = await fsPromise.readdir(from, { recursive: true, withFileTypes: true }).then((res) => {
			return res.filter((item) => item.isFile());
		});

		// Check if the overwrite file exists and remove it
		const renameItemsCollector = [];
		files.forEach(async (file) => {
			const relativePath = path.relative(from, file.parentPath);
			const newFileLocation = path.resolve(to, relativePath);
			const newFilePath = path.join(to, relativePath, file.name);
			const oldFilePath = path.join(from, relativePath, file.name);

			if (!fs.existsSync(newFileLocation)) {
				fs.mkdirSync(newFileLocation, { recursive: true });
			}

			if (fs.existsSync(newFilePath)) {
				await fsPromise.rm(newFilePath, { force: true });
			}

			renameItemsCollector.push(fsPromise.rename(oldFilePath, newFilePath));
		});

		await Promise.all(renameItemsCollector);

		if (removeAfterMove) {
			FilesHelper.remove(from);
		}
	}

	/**
	 * Create `launcher_screenshots` folder
	 * @param {string} gameFolder
	 */
	static createScreenshotsFolder(gameFolder) {
		const screenshotsFolder = path.resolve(gameFolder, "launcher_screenshots");
		if (!fs.existsSync(screenshotsFolder)) {
			fs.mkdirSync(screenshotsFolder);
		}
	}

	/**
	 * Remove file/folder
	 * @param {string} path
	 */
	static remove(path) {
		return fs.rmSync(path, { force: true, recursive: true });
	}
}

module.exports = { FilesHelper };
