import { ipcMain, dialog } from "electron";
import type { GameDataIpcHandler } from "@src/backend/types/contextBridgeChannels.type";
// prettier-ignore
import {
  getGameUserData, setGameUserData, resetStoreForGame,
  getLastSelectedGame, setLastSelectedGame
} from "@src/backend/store/userPreferences";

export function gameDataHandlers() {
  const handle = ipcMain.handle as GameDataIpcHandler;

  handle("gameData:get", (_event, value) => {
    return getGameUserData(value);
  });

  handle("gameData:set", (_event, key, value) => {
    setGameUserData(key, value);
  });

  handle("gameData:getLastSelectedGame", () => {
    return getLastSelectedGame();
  });

  handle("gameData:setLastSelectedGame", (_event, value) => {
    setLastSelectedGame(value);
  });

  handle("gameData:selectInstallDir", () => {
    return dialog.showOpenDialog({
      title: "Select install folder destination",
      properties: ["openDirectory"],
    });
  });

  handle("gameData:startGameDownload", (_event, gameId, installDirectory) => {
    // TODO: Add actionsHandler
    // actionsHandler.runWorker("downloadGameStepsWorker.cjs", {
    // 	workerData: { gameId, installDirectory },
    // });
  });

  handle("gameData:stopGameDownload", (_event, gameId) => {
    // TODO: Add actionsHandler
    // actionsHandler.terminateWorker();
    // resetStoreForGame(gameId);
  });

  handle("gameData:uninstallGame", (_event, gameId) => {
    // TODO: Add Helper
    // Helper.uninstallGame(gameId);
  });

  handle("gameData:startInstalledGame", (_event, gameId) => {
    // Store the active game's id and directory
    // actionsHandler.setRunningGame(gameId);
    // const exeConfig = Helper.getExePathForGameId(gameId, actionsHandler.runningGameDirectory);
    // const gameProcess = Helper.runExecutable(
    //   exeConfig,
    //   () => actionsHandler.sendMessage("setRunningGame", gameId),
    //   () => {
    //     actionsHandler.sendMessage("resetRunningGame", null);
    //     actionsHandler.resetRunningGame();
    //   },
    // );
    // actionsHandler.setRunningProcess(gameProcess);
  });

  handle("gameData:stopInstalledGame", () => {
    // actionsHandler.stopRunningGame();
    // actionsHandler.resetRunningGame();
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
