import { app, BrowserWindow } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { registerEvents } from "./events";
import log from "electron-log/main";
import { logger } from "@src/backend/utils/logger";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

log.initialize();

function createWindow(shouldRegisterEvents: boolean = true) {
  // Setup protocol for local file access
  const partition = "persist:ut-launcher";

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    minWidth: 1300,
    minHeight: 700,
    width: 1300,
    height: 700,
    backgroundColor: "black",
    icon: path.resolve(__dirname, "../../public/icon/icon.ico"),
    fullscreenable: false,

    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      partition: partition,
      devTools: MAIN_WINDOW_VITE_DEV_SERVER_URL ? true : false,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    process.env.DEV = "true";
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });

    logger.info("App data location:", app.getPath("userData"));
  } else {
    process.env.DEV = "false";
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (shouldRegisterEvents) {
    // Register all needed events
    registerEvents(mainWindow, partition);
  }

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(false);
  }
});
