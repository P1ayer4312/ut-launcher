const { app, BrowserWindow } = require("electron");
const path = require("node:path");
const IS_DEV = process?.argv?.includes("--dev");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.cjs"),
    },
  });

  win.loadFile("index.html");
  if (IS_DEV) {
    win.loadURL("http://localhost:5173");
  } else {
    const siteLocation = path.resolve("resources", "dist", "index.html");
    win.loadFile(siteLocation);
  }
}

app.whenReady().then(() => {
  createWindow();

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
