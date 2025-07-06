const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");

class Helper {
	/**
	 * Helper function for referencing config files location
	 * between dev and prod
	 * @param {string} env
	 * @param {string} fileLocation
	 */
	static configFilePath(env, fileLocation) {
		if (env) {
			// process.env.DEV is defined
			return path.resolve(__dirname, "../config", fileLocation);
		}

		// process.env.DEV is not defined, it's in prod
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
	 * Run executable
	 * @param {string} exePath
	 */
	static runExecutable(exePath) {
		spawn(exePath, { detached: true });
	}
}

module.exports = Helper;
