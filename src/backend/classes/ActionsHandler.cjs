/** @import { WorkerOptions } from "node:worker_threads" */
/** @import { ChildProcessWithoutNullStreams } from "node:child_process" */
/** @import { TGameId } from "../types/gameConfigData.cjs" */
const { BrowserWindow } = require("electron");
const { Worker } = require("node:worker_threads");
const path = require("node:path");
const { setGameUserData, getGameUserData } = require("../store/userPreferences.cjs");

/**
 * Class used for handling and displaying actions between Electron and the main world
 */
class ActionsHandler {
	constructor() {
		/** @type {Worker | null} */
		this.worker = null;
		this.workerFolderPath = path.resolve(__dirname, "../workers");

		/** @type {TGameId | null} */
		this.runningGame = null;
		/** @type {string | null} */
		this.runningGameDirectory = null;
		/** @type {ChildProcessWithoutNullStreams | null} */
		this.runningProcess = null;
		/** @type {number | null} */
		this.mainWindowId = null;
	}

	/**
	 * Run worker script from the `src\backend\workers` folder
	 * @param {string} workerFileName
	 * @param {WorkerOptions} workerOptions
	 */
	runWorker(workerFileName, workerOptions) {
		if (this.worker !== null) {
			throw new Error(`More than one worker cannot be present at the same time`);
		}

		this.worker = new Worker(path.resolve(this.workerFolderPath, workerFileName), {
			env: {
				...workerOptions.env,
				DEV: process.env.DEV,
			},
			...workerOptions,
		});

		this.worker.on("message", (data) => {
			if (data.key === "updateLocalGameStore") {
				// Can't change the local store from within a worker
				setGameUserData(data.value.gameId, { installed: data.value.installed });
			}

			this.sendMessage(data.key, data.value);
		});

		this.worker.on("error", (err) => {
			// eslint-disable-next-line no-console
			console.error("WORKER_ERROR", err);
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
	}

	/**
	 * Emit an event to the main window. Message handlers are defined inside `ContextBridgeMessageHandler.jsx`
	 * @param {string} keyString
	 * @param {any} message
	 */
	sendMessage(keyString, message) {
		const mainWindow = BrowserWindow.fromId(this.mainWindowId);
		mainWindow.webContents.send("actionsHandler-message", {
			key: keyString,
			value: message,
		});
	}

	/**
	 * Set current running game and store its directory for later user
	 * @param {TGameId} gameId
	 */
	setRunningGame(gameId) {
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

	/**
	 * Store a reference to the running game
	 * @param {ChildProcessWithoutNullStreams} proc
	 */
	setRunningProcess(proc) {
		this.runningProcess = proc;
	}

	/**
	 * Store the main window's id for reference
	 * @param {number} num
	 */
	setMainWindowId(num) {
		console.log(num);
		this.mainWindowId = num;
	}
}

module.exports = ActionsHandler;
