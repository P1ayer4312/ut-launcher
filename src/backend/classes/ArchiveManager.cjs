const js7z = require("js7z-tools");
const path = require("node:path");

class ArchiveManager {
	/**
	 * Extract files to a destination folder
	 * @param {string} filePath
	 * @param {string} destinationDirectory
	 * @param {((value: string) => void) | undefined} printCallback
	 */
	static async extractFiles(filePath, destinationDirectory, printCallback = undefined) {
		return new Promise(async (resolve, reject) => {
			try {
				const wasm7z = await js7z({ onExit: resolve, onAbort: reject, print: printCallback });

				// Create virtual folders and mount them to system storage
				wasm7z.FS.mkdir("/in");
				wasm7z.FS.mkdir("/out");
				wasm7z.FS.mount(wasm7z.NODEFS, { root: path.dirname(filePath) }, "/in");
				wasm7z.FS.mount(wasm7z.NODEFS, { root: destinationDirectory }, "/out");

				// Extract the file
				wasm7z.callMain(["x", `/in/${path.basename(filePath)}`, "-o/out", "-aoa"]);
			} catch (error) {
				console.error(error);
				reject(error);
			}
		});
	}

	/**
	 * Extract files to a destination folder with ignore list. The ignore text file needs to be
	 * in the same folder as the archive file
	 * @param {string} filePath
	 * @param {string} destinationDirectory
	 * @param {string} ignoreFileName
	 * @param {((value: string) => void) | undefined} printCallback
	 */
	static async extractFilesWithIgnore(
		filePath,
		destinationDirectory,
		ignoreFileName,
		printCallback = undefined
	) {
		return new Promise(async (resolve, reject) => {
			try {
				const wasm7z = await js7z({ onExit: resolve, onAbort: reject, print: printCallback });

				// Create virtual folders and mount them to system storage
				wasm7z.FS.mkdir("/in");
				wasm7z.FS.mkdir("/out");
				wasm7z.FS.mount(wasm7z.NODEFS, { root: path.dirname(filePath) }, "/in");
				wasm7z.FS.mount(wasm7z.NODEFS, { root: destinationDirectory }, "/out");

				// Extract the file
				wasm7z.callMain([
					"x",
					"-aoa",
					"-o/out",
					"-bsp1",
					`-x@/in/${ignoreFileName}`,
					`/in/${path.basename(filePath)}`,
				]);
			} catch (error) {
				console.error(error);
				reject(error);
			}
		});
	}
}

module.exports = ArchiveManager;
