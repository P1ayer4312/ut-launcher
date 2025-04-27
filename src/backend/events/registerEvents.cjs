const { ipcMain, BrowserWindow, app } = require("electron");

/**
 * @param {BrowserWindow} window
 */
function registerEvents(window) {
  ipcMain.handle("titlebar-close", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  ipcMain.handle("titlebar-maximize", () => {
    if (window.isMaximized()) {
      window.restore();
    } else {
      window.maximize();
    }
  });

  ipcMain.handle("titlebar-minimize", () => {
    window.minimize();
  });
}

module.exports = { registerEvents };
