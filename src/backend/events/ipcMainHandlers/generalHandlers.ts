import type { ActionsHandlerIpcHandler } from "@src/backend/types/contextBridgeChannels.type";
import path from "node:path";
import fs from "node:fs";
import { ipcMain, shell, clipboard, nativeImage } from "electron";
import { actionsHandler } from "@src/backend/classes/ActionsHandler";
import { ipcLogger } from "@src/backend/utils/logger";

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
    ipcLogger.info("actionsHandler:fetchScreenshotsFromPath", `Num screenshots: ${parsed.length}`);
    return parsed;
  });

  handle("actionsHandler:open", (_event, value) => {
    shell.openPath(path.resolve(value));
    ipcLogger.info("actionsHandler:open");
  });

  handle("actionsHandler:copyImgToClipboard", (_event, value) => {
    const img = nativeImage.createFromPath(value);
    clipboard.writeImage(img);
    ipcLogger.info("actionsHandler:copyImgToClipboard", `Copied to clipboard: ${value}`);
  });

  handle("actionsHandler:isDev", () => {
    const returnValue = process.env.DEV;
    ipcLogger.info("actionsHandler:isDev", returnValue);
    return returnValue;
  });

  handle("actionsHandler:platform", () => {
    const returnValue = process.platform;
    ipcLogger.info("actionsHandler:platform", returnValue);
    return returnValue;
  });

  handle("actionsHandler:flashFrame", (_event, value) => {
    const mainWindow = actionsHandler.getMainWindow();
    if (!mainWindow) {
      throw new Error("Unable to reference the mainWindow");
    }

    // Indicate that a user interaction is required
    if (value) {
      mainWindow.flashFrame(true);
      mainWindow.setProgressBar(1, { mode: "paused" });
    } else {
      mainWindow.flashFrame(false);
      mainWindow.setProgressBar(0);
    }

    ipcLogger.info("actionsHandler:flashFrame");
  });

  handle("actionsHandler:registerGameKey", (event, value) => {
    throw new Error("Feature not implemented");
    // const key = registerGameKey(value);
    // console.log("KEY", key);
  });
}
