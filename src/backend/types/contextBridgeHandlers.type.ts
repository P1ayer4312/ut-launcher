import type { TContinueModalVariants, TScriptName } from "@src/backend/types/customTypes.type";
import type { TGameId } from "@src/backend/types/gameConfigData.type";
import type { AxiosProgressEvent } from "axios";

export type TContextBridgeActionsHandler = {
  onMessageEvent: (callback: (data: TActionsHandlerMessageEventData) => void) => Promise<void>;
  fetchScreenshotsFromPath: (value: string) => Promise<string[]>;
  open: (value: string) => Promise<void>;
  copyImgToClipboard: (value: string) => Promise<void>;
  isDev: () => Promise<string>;
  platform: () => Promise<NodeJS.Platform>;
  flashFrame: (enable: boolean) => Promise<void>;
  runScript: (scriptName: TScriptName) => Promise<void>;
};

export type TContextBridgeTitleBar = {
  close: () => Promise<void>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
};

/** Map expected value for each key event */
export type TEventKeyValueMapping = {
  progressFormatted: string;
  progress: Partial<AxiosProgressEvent>;
  screenshot: null;
  updateLocalGameStore: { gameId: TGameId; installed: boolean };
  setRunningGame: TGameId;
  resetRunningGame: null;
  uninstallingGameMessage: null;
  uninstallFinished: TGameId;
  error: unknown;
  runPowershellFromWorker: string[];
  openContinueModal: { isOpened: boolean; message: string | null; variant: TContinueModalVariants };
  hideProgressBar: null;
};

/** List of all event names sent between frontend and backend */
export type TEventKeyNames = keyof TEventKeyValueMapping;

export type TActionsHandlerMessageEventData = {
  [K in TEventKeyNames]: {
    key: K;
    value: TEventKeyValueMapping[K];
  };
}[TEventKeyNames];

export type OnMessageEventCallback = (data: TActionsHandlerMessageEventData) => void;
