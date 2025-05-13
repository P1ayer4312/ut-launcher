const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { registerEvents } = require("./events/registerEvents.cjs");
const IS_DEV = process?.argv?.includes("--dev");

if (require("electron-squirrel-startup")) {
  app.quit();
}

function createWindow() {
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
    },
  });

  if (IS_DEV) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    const siteLocation = path.resolve(process.resourcesPath, "dist", "index.html");
    win.loadFile(siteLocation);
  }

  return win;
}

app.whenReady().then(() => {
  const win = createWindow();
  registerEvents(win);

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
