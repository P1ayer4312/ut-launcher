/** @import { TContextBridgeGameData } from "../../backend/types/gameConfigData.cjs" */
/** @import { TContextBridgeActionsHandler } from "../../backend/types/actionsHandler.cjs" */

/**
 * Provides all objects exposed in the main world from the `contextBridge`
 * inside `backend/preload.cjs`
 */
const contextBridge = {
  /** @type {TContextBridgeGameData} */
  gameData: window.gameData ?? {},
  /** @type {TContextBridgeActionsHandler} */
  actionsHandler: window.actionsHandler ?? {},
};

export default contextBridge;
