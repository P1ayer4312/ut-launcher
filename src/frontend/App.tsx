import "./App.scss";
import MenuItemGameList from "@src/frontend/components/menu-item/menu-item-game-list/MenuItemGameList";
import TitleBar from "@src/frontend/components/title-bar/TitleBar";
import BannerImgAndLogo from "@src/frontend/components/banner-img-and-logo/BannerImgAndLogo";
import ContextBridgeMessageHandler from "@src/frontend/contextBridge/ContextBridgeMessageHandler";
import GamePageHandler from "@src/frontend/components/game-page/game-page-handler/GamePageHandler";
import ModalWrapper from "@src/frontend/components/modal-wrapper/ModalWrapper";
import { ToastContainer } from "react-toastify";

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
      <ModalWrapper />
      <ToastContainer />
      <ContextBridgeMessageHandler />
    </>
  );
}
