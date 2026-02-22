import "./App.scss";
import MenuItemGameList from "@src/frontend/components/menu-item/menu-item-game-list/MenuItemGameList";
import TitleBar from "@src/frontend/components/title-bar/TitleBar";
import BannerImgAndLogo from "@src/frontend/components/banner-img-and-logo/BannerImgAndLogo";
import ContextBridgeMessageHandler from "./contextBridge/ContextBridgeMessageHandler";
import GamePageHandler from "@src/frontend/components/game-page/game-page-handler/GamePageHandler";

export default function App() {
  return (
    <>
      <TitleBar />
      <div className="main-grid">
        <MenuItemGameList />
        <div className="game-page-view" style={{ color: "orange" }}>
          <BannerImgAndLogo />
          <GamePageHandler />
        </div>
      </div>
      <ContextBridgeMessageHandler key={"fixed"} />
    </>
  );
}
