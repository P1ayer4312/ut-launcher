import js7z from "js7z-tools";
import path from "node:path";

type LogsCallback = ((value: string) => void) | undefined;

export class ArchiveManager {
  /**
   * Extract files to a destination folder
   */
  static async extractFiles(
    filePath: string,
    destinationDirectory: string,
    printCallback: LogsCallback = undefined,
  ) {
    return new Promise((resolve, reject) => {
      js7z({ onExit: resolve, onAbort: reject, print: printCallback })
        .then((wasm7z) => {
          // Create virtual folders and mount them to system storage
          wasm7z.FS.mkdir("/in");
          wasm7z.FS.mkdir("/out");
          wasm7z.FS.mount(wasm7z.NODEFS, { root: path.dirname(filePath) }, "/in");
          wasm7z.FS.mount(wasm7z.NODEFS, { root: destinationDirectory }, "/out");

          // Extract the file
          wasm7z.callMain(["x", `/in/${path.basename(filePath)}`, "-o/out", "-aoa"]);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          reject(error);
        });
    });
  }

  /**
   * Extract files to a destination folder with ignore list. The ignore text file needs to be
   * in the same folder as the archive file
   */
  static async extractFilesWithIgnore(
    filePath: string,
    destinationDirectory: string,
    ignoreFileName: string,
    printCallback: LogsCallback = undefined,
  ) {
    return new Promise((resolve, reject) => {
      js7z({ onExit: resolve, onAbort: reject, print: printCallback })
        .then((wasm7z) => {
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
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          reject(error);
        });
    });
  }
}
