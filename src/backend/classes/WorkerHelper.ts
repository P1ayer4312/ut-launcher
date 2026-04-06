import { parentPort, workerData } from "node:worker_threads";
import process from "node:process";
import { linksProvider } from "@src/backend/providers/linksProvider";
import type { TWorkerData, TGameId } from "@src/backend/types/gameConfigData.type";
import type { TEventKeyNames, TEventKeyValueMapping } from "@src/backend/types/contextBridgeHandlers.type";

type ExitCode = string | number | null | undefined;

/** Helper class for wrapping worker methods any giving them types */
export class WorkerHelper {
  static workerData: TWorkerData = workerData;
  static parentPort = parentPort;

  /**
   * Wrapper for `parentPort.postMessage` used for giving a type to the input
   */
  static postMessage<K extends TEventKeyNames>(key: K, value: TEventKeyValueMapping[K]) {
    // eslint-disable-next-line no-console
    console.log(`[${key}] ${JSON.stringify(value)}`);
    parentPort?.postMessage({ key, value });
  }

  /**
   * Stop the worker
   */
  static exit(code: ExitCode) {
    process.exit(code);
  }

  /**
   * Check if we work in a DEV env
   */
  static isDev() {
    return process.env.DEV == "true";
  }

  /**
   * Returns game links object from the `linksProvider`
   */
  static getGameLinks(gameId: TGameId) {
    const gameLinks = linksProvider[gameId];
    if (!gameLinks) {
      throw new Error(`Links are not provided for "${gameId}"`);
    }

    return WorkerHelper.isDev() ? gameLinks.dev : gameLinks.prod;
  }
}
