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
});
