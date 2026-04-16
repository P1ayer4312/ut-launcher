import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { resetStoreForGame, getGameUserData } from "@src/backend/store/userPreferences";
import { actionsHandler } from "./ActionsHandler";
import type { TGameId, TExeOptions, TUnreal2Type } from "@src/backend/types/gameConfigData.type";
import { logger } from "@src/backend/utils/logger";

export class Helper {
  /**
   * Run executable and wait for it to be closed
   */
  static runExecutable(
    exeOptions: TExeOptions,
    onSpawnCallback: VoidFunction,
    onCloseCallback: VoidFunction,
  ) {
    const newProcess = spawn(exeOptions.path, exeOptions.args, { detached: true });
    newProcess.once("spawn", onSpawnCallback);
    newProcess.once("close", onCloseCallback);
    newProcess.on("error", logger.error);

    return newProcess;
  }

  /**
   * Helper function for getting the path of the game's executable
   */
  static getExePathForGameId(gameId: TGameId, directory: string, option?: TUnreal2Type): TExeOptions {
    switch (gameId) {
      case "unreal":
        return { path: path.resolve(directory, gameId, "System64/Unreal.exe"), args: [] };

      case "unreal-2": {
        // Only check if XMP is sent, use SinglePlayer as default
        if (option && option === "u2-xmp") {
          return { path: path.resolve(directory, gameId, "multiplayer/SYSTEM/U2XMP.exe"), args: [] };
        }

        return { path: path.resolve(directory, gameId, "singleplayer/System/Unreal2.exe"), args: [] };
      }

      case "ut-1999":
        return { path: path.resolve(directory, gameId, "System/UnrealTournament.exe"), args: [] };

      case "ut-3":
        return { path: path.resolve(directory, gameId, "Binaries/UT3_OS_Patch.exe"), args: [] };

      case "ut-alpha":
        return {
          path: path.resolve(directory, gameId, "Engine/Binaries/Win64/UE4-Win64-Shipping.exe"),
          args: ["UnrealTournament", "-epicapp=UnrealTournamentDev", "-epicenv=Prod", "-EpicPortal"],
        };

      default:
        throw new Error("Invalid gameId provided");
    }
  }

  /**
   * Remove all game files from local storage
   */
  static async uninstallGame(gameId: TGameId) {
    const gameData = getGameUserData(gameId);
    const gameFolder = gameData.directory !== "" ? path.resolve(gameData.directory, gameId) : null;

    if (gameFolder && fs.existsSync(gameFolder)) {
      actionsHandler.sendMessage("uninstallingGameMessage", null);
      await fs.promises.rm(gameFolder, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
      resetStoreForGame(gameId);
      actionsHandler.sendMessage("uninstallFinished", gameId);
    } else {
      throw new Error("Unable to uninstall the game");
    }
  }

  static saveScreenshot() {}

  /**
   * TODO: REMOVE
   * Returns a list of maps for a selected game
   */
  static getGameMapsNames(gameId: TGameId) {
    const gameData = getGameUserData(gameId);
    const gameFolder = gameData.directory;

    if (gameId === "unreal") {
      const mapsPath = path.resolve(gameFolder, "unreal/MAPS");
      const mapNames = fs.readdirSync(mapsPath, { recursive: true }).map((item) => {
        return path.basename(String(item), ".unr");
      });

      return mapNames;
    }
  }
}
