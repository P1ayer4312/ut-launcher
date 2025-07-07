const { ipcMain, BrowserWindow, app, shell, clipboard, nativeImage } = require("electron");
const { Window } = require("node-screenshots");
const fs = require("node:fs");
const path = require("node:path");
const actionsHandler = require("../handlers/actionsHandler.cjs");

/** @param {BrowserWindow} window */
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

	window.webContents.setWindowOpenHandler((details) => {
		console.log(details);

		if (details.frameName === "popup-window") {
			return {
				action: "allow",
				overrideBrowserWindowOptions: {
					fullscreenable: false,
					backgroundColor: "black",
					autoHideMenuBar: true,
					modal: true,
				},
			};
		}

		shell.openExternal(details.url);
		return { action: "deny" };
	});

	ipcMain.handle("actionsHandler-fetchScreenshotsFromPath", (event, value) => {
		const parsed = [];
		fs.readdirSync(value).forEach((item) => {
			const fullPath = path.resolve(value, item);
			if (fs.statSync(fullPath).isFile()) {
				parsed.push(btoa(fullPath));
			}
		});

		parsed.reverse();
		return parsed;
	});

	ipcMain.handle("actionsHandler-open", (event, value) => {
		shell.openPath(path.resolve(value));
	});

	ipcMain.handle("actionsHandler-copyImgToClipboard", (event, value) => {
		const img = nativeImage.createFromPath(value);
		clipboard.writeImage(img);
	});
}

module.exports = { registerEvents };
