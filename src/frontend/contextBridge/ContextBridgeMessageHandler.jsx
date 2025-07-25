import { useEffect } from "react";
import contextBridge from "./contextBridge";
import { useGlobalState } from "../state/useGlobalState";

/**
 * Wrapper component for handling the messages between the contextBridge.
 * This is an empty component used to declutter `App.jsx`
 */
export default function ContextBridgeMessageHandler() {
	const {
		setSelectedGame,
		setProgressBar,
		setLocalDataStoreForGameId,
		setDownloadingGame,
		setRunningGame,
		setLocalDataStore,
		setModalData,
		selectedGame,
		downloadingGame,
	} = useGlobalState();

	useEffect(() => {
		const screenshotAudio = new Audio("./sounds/steam-screenshot.mp3");
		screenshotAudio.volume = 0.5;

		// Pass the last selected game from memory to the global state
		contextBridge.gameData.getLastSelectedGame().then(setSelectedGame);

		// Assign a callback function for handling messages received from Electron
		contextBridge.actionsHandler.onMessageEvent((data) => {
			switch (data.key) {
				case "progressFormatted":
					setProgressBar({ text: data.value });
					break;

				case "progress":
					setProgressBar({ percentage: Math.floor(data.value.progress * 100) });
					break;

				case "screenshot":
					screenshotAudio.play();
					break;

				case "updateLocalGameStore":
					setLocalDataStoreForGameId(data.value.gameId, { installed: data.value.installed });
					setDownloadingGame(null);
					break;

				case "setRunningGame":
					setRunningGame(data.value);
					break;

				case "resetRunningGame":
					setRunningGame(null);
					break;

				case "uninstallingGameMessage":
					console.log("======= called ?");
					setProgressBar({ percentage: 0, text: "Removing game files..." });
					// Progress bar is shown only if the game is being downloaded,
					// so we just set it to "downloading" for it to be displayed
					setDownloadingGame(selectedGame);
					setModalData({ isOpened: false, modalType: "blank" });
					break;

				case "uninstallFinished":
					contextBridge.gameData.get(selectedGame).then((data) => {
						setLocalDataStore({ [selectedGame]: data });
						setDownloadingGame(null);
					});
					break;

				default:
					// eslint-disable-next-line no-console
					console.error("Unhandled message:", data);
					break;
			}
		});
	}, [
		downloadingGame,
		selectedGame,
		setDownloadingGame,
		setLocalDataStore,
		setLocalDataStoreForGameId,
		setModalData,
		setProgressBar,
		setRunningGame,
		setSelectedGame,
	]);

	return null;
}
