import { useEffect, useRef } from "react";
import contextBridge from "./contextBridge";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import { logger } from "@src/frontend/utils/logger";

/**
 * Wrapper component for handling the messages between the contextBridge.
 * This is an empty component used to declutter `App.tsx`
 */
export default function ContextBridgeMessageHandler() {
  // prettier-ignore
  const {
    setSelectedGame, setProgressBar, setLocalDataStoreForGameId, setDownloadingGame,
    setRunningGame, setLocalDataStore, setModalData, selectedGame, downloadingGame,
  } = useGlobalState();

  const isFirstRunRef = useRef<boolean>(true);

  useEffect(
    () => {
      if (isFirstRunRef.current) {
        // Make useEffect run only once, even if it's rerendered
        isFirstRunRef.current = false;

        // Catch any errors and display them inside a modal
        const displayErrorFunc = (err: ErrorEvent) => {
          setModalData({ isOpened: true, modalType: "error", errorModalText: String(err.message) });
        };
        window.addEventListener("error", displayErrorFunc);

        // Pass the last selected game from memory to the global state
        contextBridge.gameData.getLastSelectedGame().then(setSelectedGame);

        // Assign a callback function for handling messages received from Electron
        contextBridge.actionsHandler.onMessageEvent((dataReceived) => {
          switch (dataReceived.key) {
            case "progressFormatted": {
              setProgressBar({ text: dataReceived.value });
              break;
            }

            case "progress": {
              const progress: number = dataReceived.value?.progress || 0;
              setProgressBar({ percentage: Math.floor(progress * 100) });
              break;
            }

            case "updateLocalGameStore": {
              setLocalDataStoreForGameId(dataReceived.value.gameId, {
                installed: dataReceived.value.installed,
              });
              setDownloadingGame(null);
              break;
            }

            case "setRunningGame": {
              setRunningGame(dataReceived.value);
              break;
            }

            case "resetRunningGame": {
              setRunningGame(null);
              break;
            }

            case "uninstallingGameMessage": {
              setProgressBar({ percentage: 0, text: "Removing game files..." });
              // Progress bar is shown only if the game is being downloaded,
              // so we just set it to "downloading" for it to be displayed
              setDownloadingGame(selectedGame);
              setModalData({ isOpened: false, modalType: "blank" });
              break;
            }

            case "uninstallFinished": {
              const selectedGame = dataReceived.value;
              contextBridge.gameData.get(selectedGame).then((data) => {
                setLocalDataStore({ [selectedGame]: data });
                setDownloadingGame(null);
              });
              break;
            }

            case "error": {
              setModalData({
                isOpened: true,
                modalType: "error",
                errorModalText: String(dataReceived.value),
              });
              break;
            }

            case "hideProgressBar": {
              setDownloadingGame(null);
              break;
            }

            case "openContinueModal": {
              setModalData({
                modalType: "continue",
                isOpened: dataReceived.value.isOpened,
                continueModalText: dataReceived.value.message,
                continueModalVariant: dataReceived.value.variant,
              });
              break;
            }

            default: {
              logger.error("Unhandled message:", dataReceived);
              break;
            }
          }
        });
      }
    },
    // prettier-ignore
    [
			downloadingGame, selectedGame, setDownloadingGame, setLocalDataStore,	setModalData,
			setProgressBar,	setRunningGame,	setSelectedGame, setLocalDataStoreForGameId
		],
  );

  return null;
}
