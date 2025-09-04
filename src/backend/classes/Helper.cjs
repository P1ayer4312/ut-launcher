/** @import { TGameId } from "../types/gameConfigData.cjs" */
const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");
const { resetStoreForGame, getGameUserData } = require("../store/userPreferences.cjs");
const { actionsHandler } = require("../handlers/actionsHandler.cjs");

class Helper {
	/**
	 * Run executable
	 * @param {string} exePath
	 * @param {() => void} onSpawnCallback
	 * @param {() => void} onCloseCallback
	 */
	static runExecutable(exePath, onSpawnCallback, onCloseCallback) {
		const newProcess = spawn(exePath, { detached: true });
		newProcess.once("spawn", onSpawnCallback);
		newProcess.once("close", onCloseCallback);

		return newProcess;
	}

	/**
	 * Helper function for getting the path of the game's executable
	 * @param {TGameId} gameId
	 * @param {string} directory
	 */
	static getExePathForGameId(gameId, directory) {
		switch (gameId) {
			case "ut-1999":
				return path.resolve(directory, gameId, "System/UnrealTournament.exe");

			default:
				throw new Error("Invalid gameId provided");
		}
	}

	/**
	 * Remove all game files from local storage
	 * @param {TGameId} gameId
	 */
	static async uninstallGame(gameId) {
		const gameData = getGameUserData(gameId);
		const gameFolder = gameData.directory !== "" ? path.resolve(gameData.directory, gameId) : null;
		if (gameFolder && fs.existsSync(gameFolder)) {
			actionsHandler.sendMessage("uninstallingGameMessage", null);
			fs.rmSync(gameFolder, { recursive: true });
			resetStoreForGame(gameId);
			actionsHandler.sendMessage("uninstallFinished", null);
		} else {
			throw new Error("Unable to uninstall the game");
		}
	}

	static saveScreenshot() {}
}

module.exports = { Helper };
