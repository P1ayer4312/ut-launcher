/** @import { WorkerOptions } from "node:worker_threads" */
const { BrowserWindow } = require("electron");
const { Worker } = require("node:worker_threads");
const path = require("node:path");

/**
 * Class used for handling and displaying actions between Electron and the main world
 */
class ActionsHandler {
	constructor() {
		this.abortController = null;
		this.running = false;
		/** @type {Worker | null} */
		this.worker = null;
		this.workerFolderPath = path.resolve(__dirname, "../workers");
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
		this.worker.on("message", (data) => this.sendMessage(data.key, data.value));
		this.worker.on("error", (err) => {
			console.error("WORKER_ERROR", err);
		});
		this.worker.once("exit", () => {
			this.worker = null;
		});
	}

	terminateWorker() {
		console.log("Terminating worker");
		if (this.worker && this.worker?.threadId !== -1) {
			this.worker.postMessage({
				key: "terminate",
				value: true,
			});
		}
	}

	stop() {
		this.abortController.abort();
	}

	/**
	 * Emit an event to the main window
	 * @param {string} keyString
	 * @param {any} message
	 */
	sendMessage(keyString, message) {
		// TODO: Check if there is better way to target the main window
		const mainWindow = BrowserWindow.getAllWindows().find((win) => win.title === "MAIN");
		mainWindow.webContents.send("actionsHandler-message", {
			key: keyString,
			value: message,
		});
	}
}

module.exports = ActionsHandler;
