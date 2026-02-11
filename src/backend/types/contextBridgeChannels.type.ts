import type { IpcMainInvokeEvent } from "electron";
import type { TContextBridgeGameData } from "./gameConfigData.type";

export type IpcMainGenericHandle<T> = (
  channel: T,
  listener: (event: IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown> | unknown,
) => void;

// Title bar
export type TitlebarApi = "titlebar";
export type TitlebarChannels = "close" | "minimize" | "maximize";
export type TitlebarMappedChannels = `${TitlebarApi}:${TitlebarChannels}`;

// Game data
export type GameDataApi = "gameData";
export type GameDataChannels =
  | "get"
  | "set"
  | "getLastSelectedGame"
  | "setLastSelectedGame"
  | "selectInstallDir"
  | "startGameDownload"
  | "stopGameDownload"
  | "uninstallGame"
  | "startInstalledGame"
  | "stopInstalledGame"
  | "readServerIni"
  | "saveServerIni";

export type GameDataMappedChannels = `${GameDataApi}:${GameDataChannels}`;

// TODO: Get good
type UnmapChannel<T extends string> = T extends `${string}:${infer U}` ? U : T;

export type GameDataIpcHandler = <K extends GameDataMappedChannels>(
  channel: K,
  listener: (event: IpcMainInvokeEvent, ...args: Parameters<TContextBridgeGameData[UnmapChannel<K>]>) => void,
) => void;

// TODO: Remove backup
// type UnmapChannel<T extends string> = T extends `${string}:${infer U}` ? U : T;

// export type GameDataIpcHandler = <K extends GameDataMappedChannels>(
//   channel: K,
//   listener: (
//     event: IpcMainInvokeEvent,
//     ...args: Parameters<TContextBridgeGameData[UnmapChannel<K>]>
//   ) => ReturnType<TContextBridgeGameData[UnmapChannel<K>]>,
// ) => void;
