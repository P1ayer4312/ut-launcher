const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("titleBarControls", {
  close: () => ipcRenderer.invoke("titlebar-close"),
  minimize: () => ipcRenderer.invoke("titlebar-minimize"),
  maximize: () => ipcRenderer.invoke("titlebar-maximize"),
});
