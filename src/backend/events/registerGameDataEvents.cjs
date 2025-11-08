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
}

module.exports = { registerGameDataEvents };
