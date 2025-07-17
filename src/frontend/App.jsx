import "./App.scss";
import BannerImgAndLogo from "./components/banner-img-and-logo/BannerImgAndLogo";
import MainGrid from "./components/main-grid/MainGrid";
import MenuItemGameList from "./components/menu-item/menu-item-game-list/MenuItemGameList";
import TitleBar from "./components/title-bar/TitleBar";
import GamePageHandler from "./components/game-page/game-page-handler/GamePageHandler";
import ContextBridgeMessageHandler from "./contextBridge/ContextBridgeMessageHandler";
import ModalWrapper from "./components/modal-wrapper/ModalWrapper";

function App() {
	return (
		<div>
			<MainGrid>
				<TitleBar />
				<MenuItemGameList />
				<div className="game-page-view" style={{ color: "orange" }}>
					<BannerImgAndLogo />
					<GamePageHandler />
				</div>
			</MainGrid>
			<ContextBridgeMessageHandler />
			<ModalWrapper />
		</div>
	);
}

export default App;
