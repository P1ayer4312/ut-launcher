const { contextBridge, ipcRenderer } = require("electron");

// Events for controlling the title bar buttons
contextBridge.exposeInMainWorld("titleBarControls", {
  close: () => ipcRenderer.invoke("titlebar-close"),
  minimize: () => ipcRenderer.invoke("titlebar-minimize"),
  maximize: () => ipcRenderer.invoke("titlebar-maximize"),
});

// Events for managing local game data and state
contextBridge.exposeInMainWorld("gameData", {
  get: (value) => ipcRenderer.invoke("gameData-get", value),
  getLastSelectedGame: () => ipcRenderer.invoke("gameData-getLastSelectedGame"),
  setLastSelectedGame: (value) => ipcRenderer.invoke("gameData-setLastSelectedGame", value),
});

// Events for custom actions
contextBridge.exposeInMainWorld("actionsHandler", {
  onMessageEvent: (callback) => {
    ipcRenderer.on("actionsHandler-message", (event, message) => {
      callback(message);
    });
  },
  test: () => ipcRenderer.invoke("actionsHandler-test"),
  screenshot: () => ipcRenderer.invoke("actionsHandler-screenshot"),
});
