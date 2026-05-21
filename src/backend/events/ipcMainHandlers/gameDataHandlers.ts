import { ipcMain, dialog } from "electron";
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
    return dialog.showOpenDialog({
      title: "Select install folder destination",
      properties: ["openDirectory"],
    });
  });

  handle("gameData:startGameDownload", (_event, gameId, installDirectory) => {
    ipcLogger.info("gameData:startGameDownload");
    actionsHandler.runWorker("downloadGameStepsWorker", {
      workerData: { gameId, installDirectory },
    });
  });

  handle("gameData:stopGameDownload", (_event, gameId) => {
    actionsHandler.terminateWorker();
    resetStoreForGame(gameId);
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
