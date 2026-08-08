import type { ActionsHandlerIpcHandler } from "@src/backend/types/contextBridgeChannels.type";
import path from "node:path";
import { ipcMain, shell, clipboard, nativeImage, app } from "electron";
import { actionsHandler } from "@src/backend/classes/ActionsHandler";
import { ipcLogger } from "@src/backend/utils/logger";
import { Helper } from "@src/backend/classes/Helper";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import { TScreenshotData } from "@src/backend/types/customTypes.type";
import { getGameUserData } from "@src/backend/store/userPreferences";
import { Jimp } from "jimp";

export function generalHandlers() {
  const handle = ipcMain.handle as ActionsHandlerIpcHandler;

  handle("actionsHandler:open", (_event, value, extraPath = "") => {
    shell.openPath(path.resolve(value, extraPath));
    ipcLogger.info("actionsHandler:open");
  });

  handle("actionsHandler:showItemInFolder", (_event, filePath) => {
    shell.showItemInFolder(filePath);
  });

  handle("actionsHandler:copyImgToClipboard", async (_event, value) => {
    // bmp images are not supported, we need to convert them to either jpeg or png -_-
    const tempImg = await Jimp.read(value);
    const tempImgBuffer = await tempImg.getBuffer("image/jpeg");

    const img = nativeImage.createFromBuffer(tempImgBuffer);
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

  handle("actionsHandler:runScript", (_event, value) => {
    return Helper.runScript(value);
  });

  handle("actionsHandler:appVersion", () => {
    const value = app.getVersion();
    ipcLogger.info("actionsHandler:appVersion", value);
    return value;
  });

  handle("actionsHandler:launcherSettingsAction", (_event, actionName) => {
    switch (actionName) {
      case "openAppData":
        shell.openPath(app.getPath("userData"));
        break;
      default:
        throw new Error(`Invalid action name provided: ${actionName}`);
    }
  });

  handle("actionsHandler:fetchScreenshotsForGame", (_event, gameId) => {
    const data = getGameUserData(gameId);
    const files = FilesHelper.getAllScreenshotsForGame(gameId, data.directory);
    // TODO: Pagination might be required, not sure how this'll behave with too many images
    const parsed: TScreenshotData[] = files.map((filePath) => {
      return { filePath, dataBase64: btoa(filePath) };
    });

    ipcLogger.info("actionsHandler:fetchScreenshotsForGame", `Num screenshots: ${parsed.length}`);
    return parsed;
  });
}
