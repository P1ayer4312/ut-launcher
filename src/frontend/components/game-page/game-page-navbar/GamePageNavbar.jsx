import "./GamePageNavbar.scss";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../../state/useGlobalState";
import contextBridge from "../../../contextBridge/contextBridge";
import { FaPlay, FaDownload, FaTimes } from "react-icons/fa";

/**
 * @typedef {object} NavbarProps
 * @prop {boolean} unavailable Game is unavailable to download
 * @prop {boolean} stop Stop the current download process
 *
 * @param {NavbarProps & React.PropsWithChildren} props
 */
export default function GamePageNavbar(props) {
	// ================================================================================================

	const {
		selectedGame,
		runningGame,
		downloadingGame,
		setDownloadingGame,
		localDataStore,
		setLocalDataStore,
		setLocalDataStoreForGameId,
	} = useGlobalState();

	const [gameData, setGameData] = useState(localDataStore[selectedGame]);

	useEffect(() => {
		if (!gameData) {
			// Pass the local game data storage to the global state, this is to avoid the
			// button flashing each time on game view change
			contextBridge.gameData.get(selectedGame).then((data) => {
				setGameData(data);
				setLocalDataStore({ [selectedGame]: data });
			});
		}

		// Without this the PLAY button is not shown right after the install is completed
		setGameData(localDataStore[selectedGame]);
	}, [gameData, localDataStore, selectedGame, setLocalDataStore]);

	// ================================================================================================

	function stopButtonClicked() {
		if (selectedGame === runningGame) {
			// Stop running game
			contextBridge.gameData.stopInstalledGame();
		} else {
			// Stop the game download/install process
			contextBridge.gameData.stopGameDownload(downloadingGame).then(() => setDownloadingGame(null));
		}
	}

	function playButtonClicked() {
		contextBridge.gameData.startInstalledGame(selectedGame);
	}

	function installButtonClicked() {
		contextBridge.gameData.selectInstallDir().then((data) => {
			if (data.canceled) {
				return;
			}

			const directoryPath = data.filePaths[0];
			setLocalDataStoreForGameId(selectedGame, { directory: directoryPath });

			Promise.all([
				contextBridge.gameData.set(selectedGame, { directory: directoryPath }),
				contextBridge.gameData.startGameDownload(selectedGame, directoryPath),
			]).then(() => {
				setDownloadingGame(selectedGame);
			});
		});
	}

	// ================================================================================================

	function GameButton() {
		// Show the stop button if the game is downloading
		if (selectedGame === downloadingGame || selectedGame === runningGame) {
			return (
				<div className="game-page-navbar_action-button game-page-navbar_stop" onClick={stopButtonClicked}>
					<FaTimes />
					<span>STOP</span>
				</div>
			);
		}

		// Show the play button if the game is installed
		if (gameData?.installed && downloadingGame === null) {
			return (
				<div className="game-page-navbar_action-button game-page-navbar_play" onClick={playButtonClicked}>
					<FaPlay />
					<span>PLAY</span>
				</div>
			);
		}

		// Show unavailable button
		if (props.unavailable) {
			return (
				<div className="game-page-navbar_action-button game-page-navbar_unavailable">
					<span>UNAVAILABLE</span>
				</div>
			);
		}

		// Show the install button if none of the check above pass
		return (
			<div className="game-page-navbar_action-button game-page-navbar_install" onClick={installButtonClicked}>
				<FaDownload />
				<span>INSTALL</span>
			</div>
		);
	}

	// ================================================================================================

	return (
		<div className="game-page-navbar">
			<GameButton />
			{props.children}
		</div>
	);

	// ================================================================================================
}
