import { contextBridge, ipcRenderer } from "electron";
// prettier-ignore
import type {
  TitlebarApi, TitlebarChannels,
  GameDataApi, GameDataChannels,
} from "@/backend/types/contextBridgeChannels.type";

type ContextBridgeCallback = (...args: unknown[]) => Promise<unknown>;
type ApiRecord = Partial<Record<string, ContextBridgeCallback>>;

function exposeInMainWorldFactory<V extends string, T extends string>(
  apiKey: V,
  apiNames: T[],
  customApi: ApiRecord = {},
) {
  apiNames.forEach((item) => {
    const channel: string = `${apiKey}:${item}`;
    customApi[item] = (...args: unknown[]) => ipcRenderer.invoke(channel, ...args);
  });

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
