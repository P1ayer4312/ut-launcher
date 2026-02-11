import type { TContextBridgeTitleBar } from "@src/backend/types/contextBridgeHandlers.type";
import type { TContextBridgeGameData } from "@src/backend/types/gameConfigData.type";

declare global {
  interface Window {
    titlebar: TContextBridgeTitleBar;
    gameData: TContextBridgeGameData;
  }
}
