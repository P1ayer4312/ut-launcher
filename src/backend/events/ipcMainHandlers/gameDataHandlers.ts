import { ipcMain, dialog, type OpenDialogOptions } from "electron";
import type { GameDataIpcHandler } from "@src/backend/types/contextBridgeChannels.type";
import { actionsHandler } from "@src/backend/classes/ActionsHandler";
// prettier-ignore
import {
  getGameUserData, setGameUserData, resetStoreForGame,
  getLastSelectedGame, setLastSelectedGame
} from "@src/backend/store/userPreferences";
import { Helper } from "@src/backend/classes/Helper";
import { ipcLogger } from "@src/backend/utils/logger";
import { fetchPatchesForGame } from "@src/backend/providers/patchesProvider";
import { gameKeyProvider } from "@src/backend/providers/gameKeyProvider";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import path from "node:path";

export function gameDataHandlers() {
  const handle = ipcMain.handle as GameDataIpcHandler;

  handle("gameData:get", (_event, value) => {
    const returnValue = getGameUserData(value);
    ipcLogger.info("gameData:get", JSON.stringify(returnValue));
    return returnValue;
  });

  handle("gameData:set", (_event, key, value) => {
    setGameUserData(key, value);
    ipcLogger.info("gameData:set");
  });

  handle("gameData:getLastSelectedGame", () => {
    const returnValue = getLastSelectedGame();
    ipcLogger.info("gameData:getLastSelectedGame", returnValue);
    return getLastSelectedGame();
  });

  handle("gameData:setLastSelectedGame", (_event, value) => {
    setLastSelectedGame(value);
    ipcLogger.info("gameData:setLastSelectedGame");
  });

  handle("gameData:selectInstallDir", () => {
    ipcLogger.info("gameData:selectInstallDir");

    const dialogOptions: OpenDialogOptions = {
      title: "Select install folder destination",
      properties: ["openDirectory"],
    };

    const mainWindow = actionsHandler.getMainWindow();
    if (mainWindow) {
      // Try to put the launcher's icon on the dialog window, if not
      // open a regular dialog window with only title as fallback
      return dialog.showOpenDialog(mainWindow, dialogOptions);
    }

    return dialog.showOpenDialog(dialogOptions);
  });

  handle("gameData:startGameDownload", (_event, gameId, installDirectory) => {
    ipcLogger.info("gameData:startGameDownload");
    actionsHandler.runWorker("downloadGameStepsWorker", { workerData: { gameId, installDirectory } }, true);
  });

  handle("gameData:stopGameDownload", async (_event, gameId) => {
    actionsHandler.terminateWorker();

    if (actionsHandler.removeOnStop) {
      // Remove leftover files
      const gameData = getGameUserData(gameId);
      await FilesHelper.remove(path.resolve(gameData.directory, gameId));
      resetStoreForGame(gameId);
    }

    ipcLogger.info("gameData:stopGameDownload");
  });

  handle("gameData:uninstallGame", (_event, gameId) => {
    ipcLogger.info("gameData:uninstallGame");
    Helper.uninstallGame(gameId);
  });

  handle("gameData:startInstalledGame", (_event, gameId, option) => {
    ipcLogger.info("gameData:startInstalledGame");

    // Store the active game's id and directory
    actionsHandler.setRunningGame(gameId);
    if (!actionsHandler.runningGameDirectory) {
      throw new Error(`"runningGameDirectory" not set`);
    }

    const exeConfig = Helper.getExePathForGameId(gameId, actionsHandler.runningGameDirectory, option);
    const gameProcess = Helper.runExecutable(
      exeConfig,
      () => actionsHandler.sendMessage("setRunningGame", gameId),
      () => {
        actionsHandler.sendMessage("resetRunningGame", null);
        actionsHandler.resetRunningGame();
      },
    );
    actionsHandler.setRunningProcess(gameProcess);
  });

  handle("gameData:stopInstalledGame", () => {
    actionsHandler.stopRunningGame();
    actionsHandler.resetRunningGame();
    ipcLogger.info("gameData:stopInstalledGame");
  });

  handle("gameData:fetchPatchesForGame", (_event, gameId) => {
    return fetchPatchesForGame(gameId).then((res) => {
      ipcLogger.info("gameData:fetchPatchesForGame", `Returned ${res.length} items`);
      return res;
    });
  });

  handle("gameData:downloadAndInstallPatch", (_event, gameId, patchLink) => {
    ipcLogger.info("gameData:downloadAndInstallPatch");
    const gameData = getGameUserData(gameId);
    ipcLogger.info(gameData);
    actionsHandler.runWorker("downloadAndInstallPatchWorker", {
      workerData: { gameId, installDirectory: gameData.directory, patchFileLink: patchLink },
    });
  });

  handle("gameData:getProductKey", (_event, gameId) => {
    ipcLogger.info("gameData:getProductKey");
    return gameKeyProvider(gameId);
  });

  handle("gameData:getGameConfig", async (_event, gameId) => {
    const returnValue = await Helper.getGameConfig(gameId);
    ipcLogger.info("gameData:getGameConfig", JSON.stringify(returnValue));
    return returnValue;
  });

  handle("gameData:saveGameConfig", (_event, gameId, data) => {
    ipcLogger.info("gameData:saveGameConfig", "Saving config", gameId, JSON.stringify(data));
    Helper.saveGameConfig(gameId, data);
  });

  handle("gameData:readServerIni", (_event, gameId) => {
    throw new Error("Feature not implemented");
    // return CreateServerDataHelper.readServerIni(gameId);
  });

  handle("gameData:saveServerIni", async (_event, gameId, modifiedFields) => {
    throw new Error("Feature not implemented");
    // IniHelper.saveServerIni(gameId, modifiedFields);

    // CreateServerDataHelper.readServerIni(gameId);

    // const maps = Helper.getGameMapsNames(gameId);
    // console.log(maps);
  });
}
