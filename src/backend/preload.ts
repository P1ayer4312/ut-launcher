import { contextBridge, ipcRenderer } from "electron";
// prettier-ignore
import type {
  TitlebarApi, TitlebarChannels,
  GameDataApi, GameDataChannels,
  ActionsHandlerApi, ActionsHandlerChannels
} from "@/backend/types/contextBridgeChannels.type";
import { OnMessageEventCallback, TActionsHandlerMessageEventData } from "./types/contextBridgeHandlers.type";

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
    customApi[item] = (...args: unknown[]) => ipcRenderer.invoke(channel, ...args);
  }

  contextBridge.exposeInMainWorld(apiKey, customApi);
}

// ###################################################################################################

exposeInMainWorldFactory<TitlebarApi, TitlebarChannels>("titlebar", ["close", "maximize", "minimize"]);

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
]);

exposeInMainWorldFactory<ActionsHandlerApi, ActionsHandlerChannels>(
  "actionsHandler",
  ["fetchScreenshotsFromPath", "open", "copyImgToClipboard", "registerGameKey"],
  {
    onMessageEvent: (callback: OnMessageEventCallback) => {
      if (ipcRenderer.eventNames().includes("mainWindow:message")) {
        // Avoid event memory leak
        return;
      }

      console.log("called");
      ipcRenderer.on("mainWindow:message", (_event, message: TActionsHandlerMessageEventData) => {
        callback(message);
      });
    },
  },
);
