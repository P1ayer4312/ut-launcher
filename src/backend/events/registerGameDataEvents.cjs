const { ipcMain, dialog } = require("electron");
const {
	getGameUserData,
	setGameUserData,
	getLastSelectedGame,
	setLastSelectedGame,
	resetStoreForGame,
} = require("../store/userPreferences.cjs");
const { actionsHandler } = require("../handlers/actionsHandler.cjs");
const { Helper } = require("../classes/Helper.cjs");
const { IniHelper } = require("../classes/IniHelper2.cjs");
const { IniHelper: REPLACE_ME } = require("../classes/IniHelper.cjs");
const path = require("node:path");

/**
 * Events used for fetching and storing local data for each game
 */
function registerGameDataEvents() {
	ipcMain.handle("gameData-get", (_event, value) => {
		return getGameUserData(value);
	});

	ipcMain.handle("gameData-set", (_event, key, value) => {
		setGameUserData(key, value);
	});

	ipcMain.handle("gameData-getLastSelectedGame", () => {
		return getLastSelectedGame();
	});

	ipcMain.handle("gameData-setLastSelectedGame", (_event, value) => {
		setLastSelectedGame(value);
	});

	ipcMain.handle("gameData-selectInstallDir", () => {
		return dialog.showOpenDialog({
			title: "Select install folder destination",
			properties: ["openDirectory"],
		});
	});

	ipcMain.handle("gameData-startGameDownload", (_event, gameId, installDirectory) => {
		actionsHandler.runWorker("downloadGameStepsWorker.cjs", {
			workerData: {
				gameId,
				installDirectory,
			},
		});
	});

	ipcMain.handle("gameData-stopGameDownload", (_event, gameId) => {
		actionsHandler.terminateWorker();
		resetStoreForGame(gameId);
	});

	ipcMain.handle("gameData-uninstallGame", (_event, gameId) => {
		Helper.uninstallGame(gameId);
	});

	ipcMain.handle("gameData-startInstalledGame", (_event, gameId) => {
		// Store the active game's id and directory
		actionsHandler.setRunningGame(gameId);

		const exeConfig = Helper.getExePathForGameId(gameId, actionsHandler.runningGameDirectory);
		const gameProcess = Helper.runExecutable(
			exeConfig,
			() => actionsHandler.sendMessage("setRunningGame", gameId),
			() => {
				actionsHandler.sendMessage("resetRunningGame", null);
				actionsHandler.resetRunningGame();
			},
		);

		actionsHandler.setRunningProcess(gameProcess);
	});

	ipcMain.handle("gameData-stopInstalledGame", () => {
		actionsHandler.stopRunningGame();
		actionsHandler.resetRunningGame();
	});

	ipcMain.handle("gameData-readServerIni", (_event, gameId) => {
		const serverFields = IniHelper.readServerIni(gameId);
		// console.log(serverFields);

		return serverFields;
	});

	ipcMain.handle("gameData-saveServerIni", async (_event, gameId, modifiedFields) => {
		// IniHelper.saveServerIni(gameId, modifiedFields);
		const filePath = "System64/Unreal.ini";
		const gameData = getGameUserData(gameId);
		const gameFolderFilePath = path.resolve(gameData.directory, gameId, filePath);
		const ini = new REPLACE_ME(true);
		await ini.readFile(gameFolderFilePath);
		ini.saveFile("./temp.ini");
		console.log(ini.getValuesFromSection("Engine.GameReplicationInfo", ["AdminName", "Region", "MOTDLine1"]));
	});
}

module.exports = { registerGameDataEvents };
