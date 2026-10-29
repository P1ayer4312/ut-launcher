import path from "node:path";
import { BrowserWindow } from "electron";
import { Worker, type WorkerOptions } from "node:worker_threads";
import { setGameUserData, getGameUserData } from "@src/backend/store/userPreferences";
import type { ChildProcess } from "node:child_process";
import type { TGameId } from "@src/backend/types/gameConfigData.type";
import type { TEventKeyValueMapping, TEventKeyNames } from "@src/backend/types/contextBridgeHandlers.type";
import { logger, workerLog } from "@src/backend/utils/logger";
import { Helper } from "@src/backend/classes/Helper";

/**
 * Class used for handling and displaying actions between Electron and the main world
 */
export class ActionsHandler {
  worker: Worker | null;
  workerFolderPath: string;
  runningGame: TGameId | null;
  runningGameDirectory: string | null;
  runningProcess: ChildProcess | null;
  mainWindowId: number | null;
  appDataFolder: string | null;
  removeOnStop: boolean;

  constructor() {
    this.worker = null;
    this.workerFolderPath = __dirname;
    this.runningGame = null;
    this.runningGameDirectory = null;
    this.runningProcess = null;
    this.mainWindowId = null;
    this.appDataFolder = null;
    this.removeOnStop = false;
  }

  /**
   * Run worker script from the `src\backend\workers` folder
   * @param workerFileName Only provide the file name without its extension
   * @param removeOnStop Whether or not to remove the directory of the download files
   */
  runWorker(workerFileName: string, workerOptions: WorkerOptions, removeOnStop: boolean = false) {
    if (this.worker !== null) {
      throw new Error(`More than one worker cannot be present at the same time`);
    }

    this.removeOnStop = removeOnStop;
    this.worker = new Worker(path.resolve(this.workerFolderPath, `${workerFileName}.cjs`), {
      ...workerOptions,
      env: {
        ...((workerOptions.env as object) ?? {}),
        DEV: process.env.DEV,
        DIR: __dirname,
      },
    });

    this.worker.on("message", (data) => {
      this.sendMessage(data.key, data.value);
    });

    this.worker.on("error", (err: ErrorEvent) => {
      workerLog.error("WORKER_ERROR", err);
      this.sendMessage("error", String(err.message));
    });

    this.worker.once("exit", () => {
      this.worker = null;
    });
  }

  terminateWorker() {
    if (this.worker && this.worker?.threadId !== -1) {
      logger.info("Terminating worker");
      this.worker.postMessage({ key: "terminate", value: true });

      // We go with the force terminate because I didn't find any good way
      // to stop the WASM part during running
      this.worker.terminate();
    }

    setTimeout(() => {
      // There might be a better way to do the progressbar cleaning idk
      if (!this.mainWindowId) {
        throw new Error(`"mainWindowId" is not set`);
      }

      const mainWindow = BrowserWindow.fromId(this.mainWindowId);
      if (mainWindow) {
        mainWindow.setProgressBar(0);
      }
    }, 3000);
  }

  /** Emit an event to the main window. Message handlers are defined inside `ContextBridgeMessageHandler.tsx`*/
  sendMessage<K extends TEventKeyNames>(key: K, value: TEventKeyValueMapping[K]) {
    const mainWindow = this.getMainWindow();
    if (!mainWindow) {
      throw new Error("Can't find the main window");
    }

    switch (key) {
      case "progress": {
        const val = value as TEventKeyValueMapping["progress"];
        mainWindow.setProgressBar(Number(val.progress?.toFixed(2)) || 0);
        break;
      }

      case "hideProgressBar":
      case "uninstallFinished": {
        mainWindow.setProgressBar(0);
        break;
      }

      case "updateLocalGameStore": {
        // Can't change the local store from within a worker
        const val = value as TEventKeyValueMapping["updateLocalGameStore"];
        setGameUserData(val.gameId, { installed: val.installed });
        mainWindow.setProgressBar(0);
        break;
      }

      case "runScriptFromWorker": {
        const val = value as TEventKeyValueMapping["runScriptFromWorker"];
        Helper.runScript(val);
        break;
      }

      default:
        break;
    }

    mainWindow.webContents.send("mainWindow:message", { key, value });
  }

  /**
   * Set current running game and store its directory for later user
   * @param {TGameId} gameId
   */
  setRunningGame(gameId: TGameId) {
    const gameData = getGameUserData(gameId);
    this.runningGame = gameId;
    this.runningGameDirectory = gameData.directory;
  }

  /** Reset active game */
  resetRunningGame() {
    this.runningGame = null;
    this.runningGameDirectory = null;
  }

  /** Stop any running game if present */
  stopRunningGame() {
    if (this.runningProcess?.kill()) {
      this.runningProcess = null;
    } else {
      logger.error("Unable to terminate executable");
    }
  }

  /** Store a reference to the running game */
  setRunningProcess(proc: ChildProcess) {
    this.runningProcess = proc;
  }

  /**  Store the main window's id for reference */
  setMainWindowId(num: number) {
    this.mainWindowId = num;
  }

  /** Returns a reference to the main window */
  getMainWindow() {
    if (!this.mainWindowId) {
      throw new Error(`"mainWindowId" is not set`);
    }

    return BrowserWindow.fromId(this.mainWindowId);
  }

  /** Store the app data folder path for later use */
  setAppDataFolder(path: string) {
    this.appDataFolder = path;
  }

  getMessageBridgeFile() {
    if (!this.appDataFolder) {
      throw new Error(`"appDataFolder" is not set`);
    }

    return path.resolve(this.appDataFolder, "messageBridge.tmp");
  }
}

// Singleton
export const actionsHandler = new ActionsHandler();
