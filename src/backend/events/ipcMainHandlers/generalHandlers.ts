import { actionsHandler } from "@src/backend/classes/ActionsHandler";
import type {
  ActionsHandlerMappedChannel,
  IpcMainGenericHandle,
  TitlebarMappedChannels,
} from "@src/backend/types/contextBridgeChannels.type";

import { app, ipcMain, type BrowserWindow } from "electron";

type GenericHandler = IpcMainGenericHandle<TitlebarMappedChannels> &
  IpcMainGenericHandle<ActionsHandlerMappedChannel>;

export function generalHandlers(window: BrowserWindow) {
  // Store mainWindow's id
  actionsHandler.setMainWindowId(window.id);

  const handle = ipcMain.handle as GenericHandler;

  handle("titlebar:close", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  handle("titlebar:maximize", () => {
    if (window.isMaximized()) {
      window.restore();
    } else {
      window.maximize();
    }
  });

  handle("titlebar:minimize", () => {
    window.minimize();
  });

  // handle("actionsHandler:copyImgToClipboard");
}
