import type {
  TContextBridgeTitleBar,
  TContextBridgeActionsHandler,
} from "@src/backend/types/contextBridgeHandlers.type";
import type { TContextBridgeGameData } from "@src/backend/types/gameConfigData.type";

declare global {
  interface Window {
    titleBar: TContextBridgeTitleBar;
    gameData: TContextBridgeGameData;
    actionsHandler: TContextBridgeActionsHandler;
  }

  namespace NodeJS {
    interface ProcessEnv {
      DEV: "true" | "false";
      DIR?: string;
    }
  }
}
