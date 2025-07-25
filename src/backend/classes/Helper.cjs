/** @import { TGameId } from "../types/gameConfigData.cjs" */
const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");
const { resetStoreForGame, getGameUserData } = require("../store/userPreferences.cjs");
const actionsHandler = require("../handlers/actionsHandler.cjs");

class Helper {
	/**
	 * Helper function for referencing config files location
	 * between dev and prod
	 * @param {string} env
	 * @param {string} fileLocation
	 */
	static configFilePath(env, fileLocation) {
		if (env) {
			// process.env.DEV is defined
			return path.resolve(__dirname, "../config", fileLocation);
		}

		// process.env.DEV is not defined, it's in prod
		return path.resolve(process.resourcesPath, "config", fileLocation);
	}

	/**
	 * Copy file from one place to another
	 * @param {string} source
	 * @param {string} dest
	 */
	static async copyFile(source, dest) {
		return new Promise((resolve, reject) => {
			const fileName = path.basename(source);
			const readStream = fs.createReadStream(source);
			const writeStream = fs.createWriteStream(path.resolve(dest, fileName));

			readStream.on("error", reject);
			writeStream.on("error", reject);
			writeStream.on("close", resolve);

			readStream.pipe(writeStream);
		});
	}

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

module.exports = Helper;
