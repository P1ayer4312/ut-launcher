const { ipcMain, BrowserWindow, dialog } = require("electron");
const {
	getGameUserData,
	setGameUserData,
	getLastSelectedGame,
	setLastSelectedGame,
} = require("../store/userPreferences.cjs");
const actionsHandler = require("../handlers/actionsHandler.cjs");

/**
 * Events used for fetching and storing local data for each game
 * @param {BrowserWindow} window
 */
function registerGameDataEvents(window) {
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

	ipcMain.handle("gameData-stopGameDownload", (event) => {
		actionsHandler.terminateWorker();
	});
}

module.exports = { registerGameDataEvents };
