import InnoExtract from "innoextract-wasm";
import js7z from "js7z-tools";
import path from "node:path";
import { logger } from "@src/backend/utils/logger";

type TLogsCallback = ((value: string) => void) | undefined;

export class ArchiveManager {
  /**
   * Extract files to a destination folder
   */
  static async extractFiles(
    filePath: string,
    destinationDirectory: string,
    printCallback: TLogsCallback = undefined,
  ) {
    return new Promise((resolve, reject) => {
      const errorLogsCollector: string[] = [];
      js7z({
        onExit: () => {
          // Check if there were any error before exiting
          if (errorLogsCollector.length > 0) {
            reject(errorLogsCollector.join(" "));
          }

          resolve(true);
        },
        onAbort: reject,
        print: printCallback,
        printErr: (errorLog: string) => errorLogsCollector.push(errorLog),
      })
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
          logger.error(error);
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
    printCallback: TLogsCallback = undefined,
  ) {
    return new Promise((resolve, reject) => {
      const errorLogsCollector: string[] = [];
      js7z({
        onExit: () => {
          // Check if there were any error before exiting
          if (errorLogsCollector.length > 0) {
            reject(errorLogsCollector.join(" "));
          }

          resolve(true);
        },
        onAbort: reject,
        print: printCallback,
        printErr: (errorLog: string) => errorLogsCollector.push(errorLog),
      })
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
          logger.error(error);
          reject(error);
        });
    });
  }

  static async extractInnoInstaller(
    filePath: string,
    destinationDirectory: string,
    printCallback: TLogsCallback = undefined,
  ) {
    return new Promise((resolve, reject) => {
      const errorLogsCollector: string[] = [];
      InnoExtract({
        onExit: () => {
          // Check if there were any error before exiting
          if (errorLogsCollector.length > 0) {
            reject(errorLogsCollector.join(" "));
          }

          resolve(true);
        },
        onAbort: reject,
        print: printCallback,
        printErr: (errorLog: string) => errorLogsCollector.push(errorLog),
      })
        .then((wasmInno) => {
          // Create virtual folders and mount them to system storage
          wasmInno.FS.mkdir("/in");
          wasmInno.FS.mkdir("/out");
          wasmInno.FS.mount(wasmInno.NODEFS, { root: path.dirname(filePath) }, "/in");
          wasmInno.FS.mount(wasmInno.NODEFS, { root: destinationDirectory }, "/out");

          // Extract the file
          wasmInno.callMain(["-e", `/in/${path.basename(filePath)}`, "-d", "/out"]);
        })
        .catch((error) => {
          logger.error(error);
          reject(error);
        });
    });
  }
}
