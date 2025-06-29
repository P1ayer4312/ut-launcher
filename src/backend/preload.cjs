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
	set: (key, value) => ipcRenderer.invoke("gameData-set", key, value),
	getLastSelectedGame: () => ipcRenderer.invoke("gameData-getLastSelectedGame"),
	setLastSelectedGame: (value) => ipcRenderer.invoke("gameData-setLastSelectedGame", value),
	selectInstallDir: () => ipcRenderer.invoke("gameData-selectInstallDir"),
	startGameDownload: (gameId, installDirectory) => {
		ipcRenderer.invoke("gameData-startGameDownload", gameId, installDirectory);
	},
	stopGameDownload: () => ipcRenderer.invoke("gameData-stopGameDownload"),
});

// Events for custom actions
contextBridge.exposeInMainWorld("actionsHandler", {
	onMessageEvent: (callback) => {
		ipcRenderer.on("actionsHandler-message", (event, message) => callback(message));
	},
	test: () => ipcRenderer.invoke("actionsHandler-test"),
	screenshot: () => ipcRenderer.invoke("actionsHandler-screenshot"),
	fetchScreenshotsFromPath: (value) => ipcRenderer.invoke("actionsHandler-fetchScreenshotsFromPath", value),
	open: (value) => ipcRenderer.invoke("actionsHandler-open", value),
	copyImgToClipboard: (value) => ipcRenderer.invoke("actionsHandler-copyImgToClipboard", value),
});
