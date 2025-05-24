const { ipcMain, BrowserWindow, app, shell } = require("electron");
const ActionsHandler = require("../classes/ActionsHandler.cjs");
const { setTimeout } = require("node:timers/promises");

/** @param {BrowserWindow} window */
function registerEvents(window) {
  const actionsHandler = new ActionsHandler();

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

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  ipcMain.handle("actionsHandler-test", () => {
    actionsHandler.runActions(async (sendMessage) => {
      sendMessage("Download sim");
      await setTimeout(2000);
      sendMessage("Download sim 2");
      await setTimeout(5000);
      sendMessage("Installing...");
      await setTimeout(5000);
      sendMessage("Done");
    });
  });
}

module.exports = { registerEvents };
