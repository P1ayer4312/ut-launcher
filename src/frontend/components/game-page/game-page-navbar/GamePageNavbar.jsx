import "./GamePageNavbar.scss";
import { useEffect, useState } from "react";
import { useGlobalState } from "../../../state/useGlobalState";
import contextBridge from "../../../contextBridge/contextBridge";

/**
 * @typedef {object} NavbarProps
 * @prop {boolean} unavailable Game is unavailable to download
 * @prop {boolean} stop Stop the current download process
 *
 * @param {NavbarProps & React.PropsWithChildren} props
 */
export default function GamePageNavbar(props) {
	const { selectedGame, downloadingGame, setDownloadingGame, localDataStore, setLocalDataStore } =
		useGlobalState();

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
	}, [gameData, selectedGame, setLocalDataStore]);

	function GameButton() {
		// Show the stop button if the game is downloading
		if (selectedGame === downloadingGame) {
			return (
				<div
					className="game-page-navbar_action-button game-page-navbar_stop"
					onClick={() => {
						console.log("stop clicked");
						contextBridge.gameData.stopGameDownload().then(() => setDownloadingGame(null));
					}}
				>
					STOP
				</div>
			);
		}

		// Show the play button if the game is installed
		if (gameData?.installed) {
			return (
				<div
					className="game-page-navbar_action-button game-page-navbar_play"
					onClick={() => {
						contextBridge.gameData.get(selectedGame).then(console.log);
					}}
				>
					PLAY
				</div>
			);
		}

		// Show unavailable button
		if (props.unavailable) {
			return <div className="game-page-navbar_action-button game-page-navbar_unavailable">UNAVAILABLE</div>;
		}

		// Show the install button if none of the check above pass
		return (
			<div
				className="game-page-navbar_action-button game-page-navbar_install"
				onClick={() => {
					contextBridge.gameData.selectInstallDir().then((data) => {
						if (data.canceled) {
							return;
						}
						// TODO: Refactor this part
						const temp = { ...gameData, directory: data.filePaths[0] };
						setLocalDataStore({ [selectedGame]: temp });
						setGameData(temp);

						Promise.all([
							contextBridge.gameData.set(selectedGame, temp),
							contextBridge.gameData.startGameDownload(selectedGame, data.filePaths[0]),
						]).then(() => {
							setDownloadingGame(selectedGame);
						});
					});
				}}
			>
				INSTALL
			</div>
		);
	}

	return (
		<div className="game-page-navbar">
			<GameButton />
			{props.children}
		</div>
	);
}
