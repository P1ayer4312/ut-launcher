const js7z = require("js7z-tools");
const path = require("node:path");

class ArchiveManager {
  /**
   * Extract a file to a destination folder
   * @param {string} filePath
   * @param {string} destinationDirectory
   */
  static async extractFile(filePath, destinationDirectory) {
    return new Promise(async (resolve, reject) => {
      try {
        const wasm7z = await js7z({ onExit: resolve, onAbort: reject });

        // Create virtual folders and mount them to system storage
        wasm7z.FS.mkdir("/in");
        wasm7z.FS.mkdir("/out");
        wasm7z.FS.mount(wasm7z.NODEFS, { root: path.dirname(filePath) }, "/in");
        wasm7z.FS.mount(wasm7z.NODEFS, { root: destinationDirectory }, "/out");

        // Extract the file
        wasm7z.callMain(["x", `/in/${path.basename(filePath)}`, "-o/out", "-aoa"]);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = ArchiveManager;
