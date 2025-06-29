const { ipcMain, BrowserWindow, app, shell, clipboard, nativeImage } = require("electron");
const DownloadManager = require("../classes/DownloadManger.cjs");
const ArchiveManager = require("../classes/ArchiveManager.cjs");
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

	ipcMain.handle("actionsHandler-test", () => {
		actionsHandler.runActions(async (sendMessage) => {
			// TODO: REMOVE EVERYTHING AND REFACTOR IT
			fs.mkdirSync(path.resolve("D://GitHub//ut-launcher//downloads//extract"));

			await new Promise((resolve) => {
				const dl = new DownloadManager(
					"http://localhost:3000/UT_GOTY_CD1.iso",
					"D://GitHub//ut-launcher//downloads"
				);

				dl.on("progressFormatted", (data) => {
					sendMessage("progressFormatted", data);
				});
				dl.on("progress", (data) => {
					sendMessage("progress", data);
				});
				dl.on("finish", () => {
					sendMessage("finish", "Done");
					resolve();
				});

				dl.start();
			});

			await new Promise((resolve) => {
				const dl = new DownloadManager(
					"http://localhost:3000/OldUnreal-UTPatch469e-Windows.exe",
					"D://GitHub//ut-launcher//downloads"
				);

				dl.on("progressFormatted", (data) => {
					sendMessage("progressFormatted", data);
				});
				dl.on("progress", (data) => {
					sendMessage("progress", data);
				});
				dl.on("finish", () => {
					sendMessage("finish", "Done");
					resolve();
				});

				dl.start();
			});

			await ArchiveManager.extractFile(
				"D://GitHub//ut-launcher//downloads//UT_GOTY_CD1.iso",
				"D://GitHub//ut-launcher//downloads//extract"
			);
		});
	});

	ipcMain.handle("actionsHandler-screenshot", () => {
		const allWindows = Window.all();
		const mc = allWindows.find((item) => item.title.startsWith("Unreal"));
		fs.writeFileSync("./mc.png", mc.captureImageSync().toPngSync());
		actionsHandler.sendMessage("screenshot", true);
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
