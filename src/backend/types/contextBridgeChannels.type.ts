import type { IpcMainInvokeEvent } from "electron";
import type { TContextBridgeGameData } from "./gameConfigData.type";
import type { TContextBridgeActionsHandler } from "./contextBridgeHandlers.type";

export type IpcMainGenericHandle<T> = (
  channel: T,
  listener: (event: IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown> | unknown,
) => void;

// Title bar
export type TitleBarApi = "titleBar";
export type TitleBarChannels = "close" | "minimize" | "maximize";
export type TitleBarMappedChannels = `${TitleBarApi}:${TitleBarChannels}`;

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

// Actions handler
export type ActionsHandlerApi = "actionsHandler";
export type ActionsHandlerChannels =
  | "onMessageEvent"
  | "fetchScreenshotsFromPath"
  | "open"
  | "copyImgToClipboard"
  | "registerGameKey"
  | "isDev"
  | "platform";

export type ActionsHandlerMappedChannel = `${ActionsHandlerApi}:${ActionsHandlerChannels}`;

export type ActionsHandlerIpcHandler = <K extends ActionsHandlerMappedChannel>(
  channel: K,
  listener: (
    event: IpcMainInvokeEvent,
    ...args: Parameters<TContextBridgeActionsHandler[UnmapChannel<K>]>
  ) => void,
) => void;
