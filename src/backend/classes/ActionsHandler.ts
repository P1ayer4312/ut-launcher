import path from "node:path";
import { BrowserWindow } from "electron";
import { Worker, type WorkerOptions } from "node:worker_threads";
import { setGameUserData, getGameUserData } from "@src/backend/store/userPreferences";
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { TGameId } from "@src/backend/types/gameConfigData.type";
import type { TEventKeyValueMapping, TEventKeyNames } from "@src/backend/types/contextBridgeHandlers.type";

/**
 * Class used for handling and displaying actions between Electron and the main world
 */
export class ActionsHandler {
  worker: Worker | null;
  workerFolderPath: string;
  runningGame: TGameId | null;
  runningGameDirectory: string | null;
  runningProcess: ChildProcessWithoutNullStreams | null;
  mainWindowId: number | null;

  constructor() {
    this.worker = null;
    this.workerFolderPath = __dirname;
    this.runningGame = null;
    this.runningGameDirectory = null;
    this.runningProcess = null;
    this.mainWindowId = null;
  }

  /**
   * Run worker script from the `src\backend\workers` folder
   * @param workerFileName Only provide the file name without its extension
   */
  runWorker(workerFileName: string, workerOptions: WorkerOptions) {
    if (this.worker !== null) {
      throw new Error(`More than one worker cannot be present at the same time`);
    }

    this.worker = new Worker(path.resolve(this.workerFolderPath, `${workerFileName}.js`), {
      ...workerOptions,
      env: {
        ...((workerOptions.env as object) ?? {}),
        DEV: process.env.DEV,
        DIR: __dirname,
      },
    });

    this.worker.on("message", (data) => {
      if (data.key === "updateLocalGameStore") {
        // Can't change the local store from within a worker
        setGameUserData(data.value.gameId, { installed: data.value.installed });
      }

      this.sendMessage(data.key, data.value);
    });

    this.worker.on("error", (err: ErrorEvent) => {
      // eslint-disable-next-line no-console
      console.error("WORKER_ERROR", err);
      this.sendMessage("error", String(err.message));
    });

    this.worker.once("exit", () => {
      this.worker = null;
    });
  }

  terminateWorker() {
    // eslint-disable-next-line no-console
    console.log("Terminating worker");

    if (this.worker && this.worker?.threadId !== -1) {
      this.worker.postMessage({
        key: "terminate",
        value: true,
      });
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
    if (!this.mainWindowId) {
      throw new Error(`"mainWindowId" is not set`);
    }

    const mainWindow = BrowserWindow.fromId(this.mainWindowId);
    if (!mainWindow) {
      throw new Error("Can't find the main window");
    }

    if (key === "progress") {
      const val = value as TEventKeyValueMapping["progress"];
      mainWindow.setProgressBar(Number(val.progress?.toFixed(2)) || 0);
    } else if (key === "uninstallFinished" || key === "updateLocalGameStore") {
      mainWindow.setProgressBar(0);
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
      // eslint-disable-next-line no-console
      console.error("Unable to terminate executable");
    }
  }

  /** Store a reference to the running game */
  setRunningProcess(proc: ChildProcessWithoutNullStreams) {
    this.runningProcess = proc;
  }

  /**  Store the main window's id for reference */
  setMainWindowId(num: number) {
    this.mainWindowId = num;
  }
}

// Singleton
export const actionsHandler = new ActionsHandler();
