import path from "node:path";
import fs from "node:fs";
import { ipcMain, shell, clipboard, nativeImage } from "electron";
import type { ActionsHandlerIpcHandler } from "@src/backend/types/contextBridgeChannels.type";

export function generalHandlers() {
  const handle = ipcMain.handle as ActionsHandlerIpcHandler;

  handle("actionsHandler:fetchScreenshotsFromPath", (_event, value) => {
    const parsed: string[] = [];
    fs.readdirSync(value).forEach((item) => {
      const fullPath = path.resolve(value, item);
      if (fs.statSync(fullPath).isFile()) {
        parsed.push(btoa(fullPath));
      }
    });

    parsed.reverse();
    return parsed;
  });

  handle("actionsHandler:open", (_event, value) => {
    shell.openPath(path.resolve(value));
  });

  handle("actionsHandler:copyImgToClipboard", (_event, value) => {
    const img = nativeImage.createFromPath(value);
    clipboard.writeImage(img);
  });

  handle("actionsHandler:isDev", () => process.env.DEV);

  handle("actionsHandler:platform", () => process.platform);

  handle("actionsHandler:registerGameKey", (event, value) => {
    throw new Error("Feature not implemented");
    // const key = registerGameKey(value);
    // console.log("KEY", key);
  });
}
