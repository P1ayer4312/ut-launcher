import type {
  IpcMainGenericHandle,
  TitlebarMappedChannels,
} from "@src/backend/types/contextBridgeChannels.type";

import { app, ipcMain, type BrowserWindow } from "electron";

export function generalHandlers(window: BrowserWindow) {
  const handle = ipcMain.handle as IpcMainGenericHandle<TitlebarMappedChannels>;

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
}
