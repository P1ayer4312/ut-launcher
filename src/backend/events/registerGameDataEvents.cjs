const { ipcMain, dialog } = require("electron");
const {
	getGameUserData,
	setGameUserData,
	getLastSelectedGame,
	setLastSelectedGame,
	resetStoreForGame,
} = require("../store/userPreferences.cjs");
const actionsHandler = require("../handlers/actionsHandler.cjs");
const Helper = require("../classes/Helper.cjs");

/**
 * Events used for fetching and storing local data for each game
 */
function registerGameDataEvents() {
	ipcMain.handle("gameData-get", (event, value) => {
		return getGameUserData(value);
	});

	ipcMain.handle("gameData-set", (event, key, value) => {
		setGameUserData(key, value);
	});

	ipcMain.handle("gameData-getLastSelectedGame", (event) => {
		return getLastSelectedGame();
	});

	ipcMain.handle("gameData-setLastSelectedGame", (event, value) => {
		setLastSelectedGame(value);
	});

	ipcMain.handle("gameData-selectInstallDir", (event) => {
		return dialog.showOpenDialog({
			title: "Select install folder destination",
			properties: ["openDirectory"],
		});
	});

	ipcMain.handle("gameData-startGameDownload", (event, gameId, installDirectory) => {
		actionsHandler.runWorker("downloadGameStepsWorker.cjs", {
			workerData: {
				gameId,
				installDirectory,
			},
		});
	});

	ipcMain.handle("gameData-stopGameDownload", (event, gameId) => {
		actionsHandler.terminateWorker();
		resetStoreForGame(gameId);
	});

	ipcMain.handle("gameData-startInstalledGame", (event, gameId) => {
		// Store the active game's id and directory
		actionsHandler.setRunningGame(gameId);

		const gameProcess = Helper.runExecutable(
			Helper.getExePathForGameId(gameId, actionsHandler.runningGameDirectory),
			() => actionsHandler.sendMessage("setRunningGame", gameId),
			() => {
				actionsHandler.sendMessage("resetRunningGame", null);
				actionsHandler.resetRunningGame();
			}
		);

		actionsHandler.setRunningProcess(gameProcess);
	});

	ipcMain.handle("gameData-stopInstalledGame", (event) => {
		actionsHandler.stopRunningGame();
		actionsHandler.resetRunningGame();
	});
}

module.exports = { registerGameDataEvents };
