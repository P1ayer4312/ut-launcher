/** @import { TEventKeyNames, TEventKeyValueMapping } from "../types/actionsHandler.cjs" */
/** @import { TWorkerData, TGameId } from "../types/gameConfigData.cjs" */
const { parentPort, workerData } = require("node:worker_threads");
const process = require("node:process");
const { linksProvider } = require("../providers/linksProvider.cjs");

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

	/**
	 * Returns game links object from the `linksProvider`
	 * @param {TGameId} gameId
	 * @returns
	 */
	static getGameLinks(gameId) {
		return WorkerHelper.isDev() ? linksProvider[gameId].dev : linksProvider[gameId].prod;
	}
}

module.exports = { WorkerHelper };
