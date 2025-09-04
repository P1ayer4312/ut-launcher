/** @import { TActionsHandlerMessageEventData, TEventKeyNames, TEventKeyValueMapping } from "../types/actionsHandler.cjs" */
/** @import { TWorkerData } from "../types/gameConfigData.cjs" */
const { parentPort, workerData } = require("node:worker_threads");
const process = require("node:process");

/** Helper class for wrapping worker methods any giving them types */
class WorkerHelper {
	/** @type {TWorkerData} */
	static workerData = workerData;

	static parentPort = parentPort;

	/**
	 * Wrapper for `parentPort.postMessage` used for giving a type to the input
	 * @template {TEventKeyNames} K
	 * @param {K} key
	 * @param {TEventKeyValueMapping[K]} value
	 * @returns {void}
	 */
	static postMessage(key, value = null) {
		parentPort.postMessage({ key, value });
	}

	/**
	 * Stop the worker
	 * @param {string | number | null | undefined} code
	 */
	static exit(code) {
		process.exit(code);
	}

	/** Check if we work in a DEV env */
	static isDev() {
		return process.env.DEV == "true";
	}
}

module.exports = { WorkerHelper };
