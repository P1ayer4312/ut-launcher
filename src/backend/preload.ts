import { contextBridge, ipcRenderer } from "electron";
// prettier-ignore
import type {
  TitleBarApi, TitleBarChannels, GameDataApi, GameDataChannels,
  ActionsHandlerApi, ActionsHandlerChannels
} from "@src/backend/types/contextBridgeChannels.type";
import type {
  OnMessageEventCallback,
  TActionsHandlerMessageEventData,
} from "@src/backend/types/contextBridgeHandlers.type";
import { ipcLogger } from "@src/frontend/utils/logger";

type ContextBridgeCallback = (...args: never[]) => void;
type ApiRecord<K extends string> = Partial<Record<K, ContextBridgeCallback>>;

function exposeInMainWorldFactory<V extends string, T extends string>(
  apiKey: V,
  apiNames: T[],
  customApi: ApiRecord<T> = {},
) {
  const preDefinedApiNames = Object.keys(customApi);
  for (const item of apiNames) {
    if (preDefinedApiNames.includes(item)) {
      throw new Error(
        `"${item}" cannot be defined twice, either remove it from the apiNames array or remove the implementation`,
      );
    }

    const channel: string = `${apiKey}:${item}`;
    customApi[item] = (...args: unknown[]) => {
      ipcLogger.info(channel, ...args);
      return ipcRenderer.invoke(channel, ...args);
    };
  }

  contextBridge.exposeInMainWorld(apiKey, customApi);
}

// ###################################################################################################

exposeInMainWorldFactory<TitleBarApi, TitleBarChannels>("titleBar", ["close", "maximize", "minimize"]);

exposeInMainWorldFactory<GameDataApi, GameDataChannels>("gameData", [
  "get",
  "set",
  "getLastSelectedGame",
  "setLastSelectedGame",
  "selectInstallDir",
  "startGameDownload",
  "stopGameDownload",
  "uninstallGame",
  "startInstalledGame",
  "stopInstalledGame",
  "readServerIni",
  "saveServerIni",
  "fetchPatchesForGame",
  "downloadAndInstallPatch",
  "getProductKey",
  "getGameConfig",
  "saveGameConfig",
]);

exposeInMainWorldFactory<ActionsHandlerApi, ActionsHandlerChannels>(
  "actionsHandler",
  [
    "open",
    "copyImgToClipboard",
    "isDev",
    "platform",
    "flashFrame",
    "runScript",
    "appVersion",
    "launcherSettingsAction",
    "fetchScreenshotsForGame",
    "showItemInFolder",
  ],
  {
    onMessageEvent: (callback: OnMessageEventCallback) => {
      if (ipcRenderer.eventNames().includes("mainWindow:message")) {
        // Avoid event memory leak
        return;
      }

      ipcRenderer.on("mainWindow:message", (_event, message: TActionsHandlerMessageEventData) => {
        callback(message);
      });
    },
  },
);
