/** @import { TContextBridgeGameData } from "../../backend/types/gameConfigData.cjs" */

/**
 * Provides all objects exposed in the main world from the `contextBridge`
 * inside [backend/preload.cjs](../../backend/preload.cjs)
 */
const contextBridge = {
  /** @type {TContextBridgeGameData} */
  gameData: window.gameData ?? {},
};

export default contextBridge;
