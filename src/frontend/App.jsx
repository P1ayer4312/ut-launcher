import "./App.scss";
import BannerImgAndLogo from "./components/banner-img-and-logo/BannerImgAndLogo";
import MainGrid from "./components/main-grid/MainGrid";
import MenuItemGameList from "./components/menu-item-game-list/MenuItemGameList";
import TitleBar from "./components/title-bar/TitleBar";
import GamePageNavbar from "./components/game-page-navbar/GamePageNavbar";

function App() {
  return (
    <>
      <MainGrid>
        <TitleBar />
        <MenuItemGameList />
        <div className="game-page-view">
          <BannerImgAndLogo />
          <GamePageNavbar />
        </div>
      </MainGrid>
    </>
  );
}

export default App;
