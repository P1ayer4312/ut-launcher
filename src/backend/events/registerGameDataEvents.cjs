const { ipcMain, BrowserWindow, app } = require("electron");
const {
  getGameUserData,
  setGameUserData,
  getLastSelectedGame,
  setLastSelectedGame,
} = require("../store/userPreferences.cjs");

/**
 * Events used for fetching and storing local data for each game
 * @param {BrowserWindow} window
 */
function registerGameDataEvents(window) {
  ipcMain.handle("gameData-get", (event, value) => {
    return getGameUserData(value);
  });

  ipcMain.handle("gameData-getLastSelectedGame", (event) => {
    return getLastSelectedGame();
  });

  ipcMain.handle("gameData-setLastSelectedGame", (event, value) => {
    setLastSelectedGame(value);
  });
}

module.exports = { registerGameDataEvents };
