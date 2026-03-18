/**
 * Provides all objects exposed in the main world from the `contextBridge`
 * inside `backend/preload.ts`
 */
const contextBridge = {
  titleBarControls: window.titleBar,
  gameData: window.gameData,
  actionsHandler: window.actionsHandler,
};

export default contextBridge;
