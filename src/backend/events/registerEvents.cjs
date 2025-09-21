const { ipcMain, BrowserWindow, app, shell, clipboard, nativeImage } = require("electron");
const { Window } = require("node-screenshots");
const fs = require("node:fs");
const path = require("node:path");
const { actionsHandler } = require("../handlers/actionsHandler.cjs");
const { registerGameKey } = require("../handlers/registerGameKey.cjs");

/** @param {BrowserWindow} window */
function registerEvents(window) {
	actionsHandler.setMainWindowId(window.id);

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

	ipcMain.handle("actionsHandler-registerGameKey", (event, value) => {
		const key = registerGameKey(value);
		console.log("KEY", key);
	});

	// Override the default Error.toString to redirect errors to the frontend
	Error.prototype.toString = function () {
		actionsHandler.sendMessage("error", this);

		if (this === null || (typeof this !== "object" && typeof this !== "function")) {
			throw new TypeError();
		}
		let name = this.name;
		name = name === undefined ? "Error" : `${name}`;
		let msg = this.message;
		msg = msg === undefined ? "" : `${msg}`;
		if (name === "") return msg;
		if (msg === "") return name;
		return `${name}: ${msg}`;
	};
}

module.exports = { registerEvents };
