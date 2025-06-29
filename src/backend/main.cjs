const { app, BrowserWindow, dialog } = require("electron");
const path = require("node:path");
const { registerEvents } = require("./events/registerEvents.cjs");
const { registerGameDataEvents } = require("./events/registerGameDataEvents.cjs");
const { registerGlobalShortcuts } = require("./events/registerGlobalShortcuts.cjs");
const { registerSessionProtocol } = require("./events/registerSessionProtocol.cjs");
const { clearStore } = require("./store/userPreferences.cjs");

process.env.DEV = process?.argv?.includes("--dev");
// clearStore();

if (require("electron-squirrel-startup")) {
	app.quit();
}

function createWindow() {
	// Setup protocol for local file access
	const partition = "persist:ut-launcher";
	registerSessionProtocol(partition);

	const win = new BrowserWindow({
		minWidth: 1300,
		minHeight: 700,
		width: 1300,
		height: 700,
		backgroundColor: "black",
		icon: path.resolve(__dirname, "../../public/icon/icon.ico"),

		autoHideMenuBar: true,
		titleBarStyle: "hidden",
		// ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),

		webPreferences: {
			preload: path.resolve(__dirname, "preload.cjs"),
			partition: partition,
		},
	});

	if (Boolean(process.env.DEV)) {
		win.loadURL("http://localhost:5173");
		win.webContents.openDevTools();
	} else {
		const siteLocation = path.resolve(process.resourcesPath, "dist", "index.html");
		win.loadFile(siteLocation);
	}

	return win;
}

app.commandLine.appendSwitch("enable-features", "GlobalShortcutsPortal");

app.whenReady().then(() => {
	const win = createWindow();
	registerEvents(win);
	registerGameDataEvents(win);
	registerGlobalShortcuts();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
