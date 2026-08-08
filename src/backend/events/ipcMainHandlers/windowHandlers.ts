import { app, shell, ipcMain, type BrowserWindow } from "electron";
import { actionsHandler } from "@src/backend/classes/ActionsHandler";
import type {
  IpcMainGenericHandle,
  TitleBarMappedChannels,
} from "@src/backend/types/contextBridgeChannels.type";

export function windowHandlers(window: BrowserWindow) {
  // Store mainWindow's id
  actionsHandler.setMainWindowId(window.id);

  // Store app data folder
  actionsHandler.setAppDataFolder(app.getPath("userData"));

  const handle = ipcMain.handle as IpcMainGenericHandle<TitleBarMappedChannels>;

  handle("titleBar:close", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  handle("titleBar:maximize", () => {
    if (window.isMaximized()) {
      window.restore();
    } else {
      window.maximize();
    }
  });

  handle("titleBar:minimize", () => {
    window.minimize();
  });

  // Popup window and external link handle
  window.webContents.setWindowOpenHandler((details) => {
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
