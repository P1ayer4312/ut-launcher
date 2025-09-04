const path = require("node:path");
const fs = require("node:fs");

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
}

module.exports = { FilesHelper };
