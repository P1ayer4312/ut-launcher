import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { resetStoreForGame, getGameUserData } from "@src/backend/store/userPreferences";
import { actionsHandler } from "./ActionsHandler";
import { logger } from "@src/backend/utils/logger";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import { gameKeyProvider } from "@src/backend/providers/gameKeyProvider";
import { IniHelper, MultipleSectionsData } from "@src/backend/classes/IniHelper";
import type { TGameId } from "@src/backend/types/gameConfigData.type";
import type { TExeOptions, TScriptName, TUnreal2Type } from "@src/backend/types/customTypes.type";

export class Helper {
  /**
   * Run executable and wait for it to be closed
   */
  static runExecutable(
    exeOptions: TExeOptions,
    onSpawnCallback: VoidFunction,
    onCloseCallback: VoidFunction,
  ) {
    const newProcess = spawn(exeOptions.path, exeOptions.args, { detached: true, stdio: "ignore" });
    newProcess.once("spawn", onSpawnCallback);
    newProcess.once("close", onCloseCallback);
    newProcess.on("error", (err) => {
      logger.error(err.message);
      actionsHandler.sendMessage("error", err.message);
    });

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

      case "ut-2003":
        return { path: path.resolve(directory, gameId, "System/UT2003.exe"), args: [] };

      case "ut-2004":
        return { path: path.resolve(directory, gameId, "System/UT2004.exe"), args: [] };

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

    if (gameFolder === null) {
      throw new Error(`Unable to uninstall the selected game`);
    }

    actionsHandler.sendMessage("uninstallingGameMessage", null);
    await FilesHelper.remove(gameFolder);
    resetStoreForGame(gameId);
    actionsHandler.sendMessage("uninstallFinished", gameId);
  }

  /**
   * Run a Powershell script with elevated privileges
   * @param scriptPath Path of the script
   * @param args Args to pass to the script, order is important, first arg is always `messageBridgeFile`
   * @param elevated Default to `true`, set to `false` to run a script normally
   */
  static async runElevatedPowershell(scriptPath: string, args: string[] = [], elevated: boolean = true) {
    logger.info(`Running script: ${scriptPath}`);
    return new Promise((resolve, reject) => {
      // I didn't want to register and handle a protocol just for sending a few messages
      // from Powershell, so we'll use a temp file as a bridge
      const messageBridgeFile = actionsHandler.getMessageBridgeFile();
      fs.writeFileSync(messageBridgeFile, "", { encoding: "utf-8" });

      const argsMapped = [messageBridgeFile]
        .concat(args)
        .map((item) => `"${item}"`)
        .join(" ");

      const powershellArgs = [
        "-Command",
        `$proc = Start-Process powershell ${elevated ? "-Verb RunAs" : ""} -WindowStyle Hidden -PassThru -Wait ` +
          `-ArgumentList '-ExecutionPolicy Bypass -File "${scriptPath}" ${argsMapped}'; exit $proc.ExitCode`,
      ];

      let lastMessage: string = "";
      const watcher = fs.watch(messageBridgeFile, (eventType) => {
        if (eventType !== "change") {
          return;
        }

        fs.promises.readFile(messageBridgeFile, { encoding: "utf-8" }).then((text) => {
          const trimmed = text.trim();
          if (trimmed.length > 0 && lastMessage !== trimmed) {
            logger.info(`Shell: ${trimmed}`);
            lastMessage = trimmed;
            actionsHandler.sendMessage("openContinueModal", {
              isOpened: true,
              message: trimmed,
              variant: "message-block",
            });
          }
        });
      });

      const child = spawn("powershell", powershellArgs, { stdio: "inherit", windowsHide: true });
      child.on("error", reject);
      child.on("message", logger.info);
      child.once("close", (code) => {
        watcher.close();
        logger.info(`Script finished: ${scriptPath}`);
        actionsHandler.sendMessage("openContinueModal", { isOpened: false, message: null, variant: "empty" });

        if (code !== 0) {
          reject(`Elevated script failed with exit code: ${code}`);
        } else {
          resolve(code);
        }
      });
    });
  }

  /**
   * Instructions for running shell scripts for defined names
   */
  static async runScript(scriptName: TScriptName) {
    try {
      switch (scriptName) {
        case "installDriversUT4": {
          const scriptPath = FilesHelper.configFilePath(this.isDev(), "ut-alpha/scripts/installDrivers.ps1");
          const vcredist_x64 = FilesHelper.configFilePath(this.isDev(), "ut-alpha/drivers/vcredist_x64.exe");
          const dxwebsetup = FilesHelper.configFilePath(this.isDev(), "ut-alpha/drivers/dxwebsetup.exe");

          await this.runElevatedPowershell(scriptPath, [vcredist_x64, dxwebsetup]);
          break;
        }

        case "registerUT2003key": {
          const scriptPath = FilesHelper.configFilePath(this.isDev(), "ut-2003/scripts/registerKey.ps1");
          const productKey = gameKeyProvider("ut-2003");

          await this.runElevatedPowershell(scriptPath, [productKey]);
          break;
        }

        case "registerUT2004key": {
          const scriptPath = FilesHelper.configFilePath(this.isDev(), "ut-2004/scripts/registerKey.ps1");
          const productKey = gameKeyProvider("ut-2004");

          await this.runElevatedPowershell(scriptPath, [productKey]);
          break;
        }

        case "replaceUT3EncryptedKey": {
          const scriptPath = FilesHelper.configFilePath(this.isDev(), "ut-3/scripts/replaceEncryptedKey.ps1");
          const productKey = gameKeyProvider("ut-3");
          const ut3EngineIniPath = path.resolve(
            os.homedir(),
            "Documents/My Games/Unreal Tournament 3/UTGame/Config/UTEngine.ini",
          );

          if (!fs.existsSync(ut3EngineIniPath)) {
            throw `Missing UTEngine.ini, it might be removed or misconfigured. Launch the game once to regenerate the file.`;
          }

          const ini = new IniHelper(true);
          await ini.readFile(ut3EngineIniPath);
          const data = ini.getValuesFromSection("OnlineSubsystemGameSpy.OnlineSubsystemGameSpy", [
            "EncryptedProductKey",
          ]);

          if (data["EncryptedProductKey"] === undefined) {
            throw `Issues detected with UTEngine.ini, launch the game once to regenerate the file.`;
          }

          const oldEncryptedString = `EncryptedProductKey=${data["EncryptedProductKey"][0]}`;

          await this.runElevatedPowershell(
            scriptPath,
            [productKey, ut3EngineIniPath, oldEncryptedString],
            false,
          );
          break;
        }

        default:
          throw `Invalid script name provided: ${scriptName}`;
      }
    } catch (err) {
      throw new Error(String(err));
    }
  }

  static isDev() {
    return process.env.DEV === "true";
  }

  static async getGameConfig(gameId: TGameId): Promise<MultipleSectionsData[]> {
    const definedConfigs: TGameId[] = ["ut-2003", "ut-2004"];
    if (!definedConfigs.includes(gameId)) {
      throw new Error(`No config steps defined for game id: ${gameId}`);
    }

    const ini = new IniHelper(true);
    const gameData = getGameUserData(gameId);

    switch (gameId) {
      case "ut-2003": {
        const gameIniPath = path.resolve(gameData.directory, gameId, "System/UT2003.ini");
        await ini.readFile(gameIniPath);
        // prettier-ignore
        const sections = ini.getValuesFromMultipleSections([
          {
            section: "WinDrv.WindowsClient",
            keys: [
              "WindowedViewportX", "WindowedViewportY", "FullscreenViewportX",
              "FullscreenViewportY", "MenuViewportX", "MenuViewportY", "StartupFullscreen",
            ],
          },
        ]);

        return sections;
      }

      case "ut-2004": {
        const gameIniPath = path.resolve(gameData.directory, gameId, "System/UT2004.ini");
        await ini.readFile(gameIniPath);
        // prettier-ignore
        const sections = ini.getValuesFromMultipleSections([
          {
            section: "WinDrv.WindowsClient",
            keys: [
              "WindowedViewportX", "WindowedViewportY", "FullscreenViewportX",
              "FullscreenViewportY", "MenuViewportX", "MenuViewportY", "StartupFullscreen",
            ],
          },
        ]);

        return sections;
      }

      default: {
        throw new Error("Error occurred while trying to read the game config data");
      }
    }
  }

  static async saveGameConfig(gameId: TGameId, data: MultipleSectionsData[]) {
    const definedConfigs: TGameId[] = ["ut-2003", "ut-2004"];
    if (!definedConfigs.includes(gameId)) {
      throw new Error(`No config steps defined for game id: ${gameId}`);
    }

    const ini = new IniHelper(true);
    const gameData = getGameUserData(gameId);

    async function saveDataToSections(ini: IniHelper, data: MultipleSectionsData[]) {
      for (const item of data) {
        for (const key of Object.keys(item.data)) {
          ini.setValue(item.section, key, item.data[key]![0]);
        }
      }

      return ini.saveFile();
    }

    switch (gameId) {
      case "ut-2003": {
        const gameIniPath = path.resolve(gameData.directory, gameId, "System/UT2003.ini");
        await ini.readFile(gameIniPath);

        await saveDataToSections(ini, data);
        break;
      }

      case "ut-2004": {
        const gameIniPath = path.resolve(gameData.directory, gameId, "System/UT2004.ini");
        await ini.readFile(gameIniPath);

        await saveDataToSections(ini, data);
        break;
      }

      default: {
        throw new Error("Error occurred while trying to save the game config data");
      }
    }
  }
}
