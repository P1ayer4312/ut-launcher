import "./App.scss";
import BannerImgAndLogo from "./components/banner-img-and-logo/BannerImgAndLogo";
import MainGrid from "./components/main-grid/MainGrid";
import MenuItemGameList from "./components/menu-item/menu-item-game-list/MenuItemGameList";
import TitleBar from "./components/title-bar/TitleBar";
import GamePageHandler from "./components/game-page/game-page-handler/GamePageHandler";
import { useGlobalState } from "./state/useGlobalState";
import contextBridge from "./contextBridge/contextBridge";
import { useEffect } from "react";

function App() {
	const { setSelectedGame, setProgressBar, setLocalDataStoreForGameId, setDownloadingGame } =
		useGlobalState();

	useEffect(() => {
		const screenshotAudio = new Audio("./sounds/steam-screenshot.mp3");

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

				default:
					// eslint-disable-next-line no-console
					console.error("Unhandled message:", data);
					break;
			}
		});
	}, [setDownloadingGame, setLocalDataStoreForGameId, setProgressBar, setSelectedGame]);

	return (
		<>
			<MainGrid>
				<TitleBar />
				<MenuItemGameList />
				<div className="game-page-view" style={{ color: "orange" }}>
					<BannerImgAndLogo />
					<GamePageHandler />
				</div>
			</MainGrid>
		</>
	);
}

export default App;
