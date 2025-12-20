/** @import { TGameId, TExeOptions } from "../types/gameConfigData.cjs" */
const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");
const { resetStoreForGame, getGameUserData } = require("../store/userPreferences.cjs");
const { actionsHandler } = require("../handlers/actionsHandler.cjs");

class Helper {
	/**
	 * Run executable
	 * @param {TExeOptions} exeOptions
	 * @param {() => void} onSpawnCallback
	 * @param {() => void} onCloseCallback
	 */
	static runExecutable(exeOptions, onSpawnCallback, onCloseCallback) {
		const newProcess = spawn(exeOptions.path, exeOptions.args, { detached: true });
		newProcess.once("spawn", onSpawnCallback);
		newProcess.once("close", onCloseCallback);

		return newProcess;
	}

	/**
	 * Helper function for getting the path of the game's executable
	 * @param {TGameId} gameId
	 * @param {string} directory
	 * @returns {TExeOptions}
	 */
	static getExePathForGameId(gameId, directory) {
		switch (gameId) {
			case "unreal":
				return { path: path.resolve(directory, gameId, "System64/Unreal.exe"), args: [] };

			case "ut-1999":
				return { path: path.resolve(directory, gameId, "System/UnrealTournament.exe"), args: [] };

			case "ut-alpha":
				return {
					path: path.resolve(directory, gameId, "Engine/Binaries/Win64/UE4-Win64-Shipping.exe"),
					args: ["UnrealTournament", "-epicapp=UnrealTournamentDev", "-epicenv=Prod", "-EpicPortal"],
				};

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
			fs.rmSync(gameFolder, { recursive: true, force: true });
			resetStoreForGame(gameId);
			actionsHandler.sendMessage("uninstallFinished", null);
		} else {
			throw new Error("Unable to uninstall the game");
		}
	}

	static saveScreenshot() {}

	/**
	 * TODO: REMOVE
	 * Returns a list of maps for a selected game
	 * @param {TGameId} gameId
	 */
	static getGameMapsNames(gameId) {
		const gameData = getGameUserData(gameId);
		const gameFolder = gameData.directory;

		if (gameId === "unreal") {
			const mapsPath = path.resolve(gameFolder, "unreal/MAPS");
			const mapNames = fs.readdirSync(mapsPath, { recursive: true }).map((item) => {
				return path.basename(item, ".unr");
			});

			return mapNames;
		}
	}
}

module.exports = { Helper };
