const { ipcMain, BrowserWindow, app } = require("electron");
const { getGameUserData, setGameUserData } = require("../store/userPreferences.cjs");

/**
 * Events used for fetching and storing local data for each game
 * @param {BrowserWindow} window
 */
function registerGameDataEvents(window) {
  ipcMain.handle("gameData-get", (event, value) => {
    return getGameUserData(value);
  });
}

module.exports = { registerGameDataEvents };
