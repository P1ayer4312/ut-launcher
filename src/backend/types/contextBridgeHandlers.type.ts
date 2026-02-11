import type { TGameId, TGameKey } from "@/backend/types/gameConfigData.type";
import type { AxiosProgressEvent } from "axios";

export type TContextBridgeActionsHandler = {
  onMessageEvent: (callback: (data: TActionsHandlerMessageEventData) => void) => Promise<void>;
  fetchScreenshotsFromPath: (value: string) => Promise<string[]>;
  open: (value: string) => Promise<void>;
  copyImgToClipboard: (value: string) => Promise<void>;
  /** @todo Revisit the value part */
  registerGameKey: (value: TGameKey) => Promise<void>;
};

export type TContextBridgeTitleBar = {
  close: () => Promise<void>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
};

/** Map expected value for each key event */
export type TEventKeyValueMapping = {
  progressFormatted: string;
  progress: AxiosProgressEvent;
  screenshot: null;
  updateLocalGameStore: { gameId: TGameId; installed: boolean };
  setRunningGame: TGameId;
  resetRunningGame: null;
  uninstallingGameMessage: null;
  uninstallFinished: null;
  error: unknown;
};

/** List of all event names sent between frontend and backend */
export type TEventKeyNames = keyof TEventKeyValueMapping;

/**
 * Distributed Union for Message Events
 * This ensures that if key is "progress", value must be AxiosProgressEvent
 */
export type TActionsHandlerMessageEventData = {
  [K in TEventKeyNames]: {
    key: K;
    value: TEventKeyValueMapping[K];
  };
}[TEventKeyNames];
