import "./App.scss";
import BannerImgAndLogo from "./components/banner-img-and-logo/BannerImgAndLogo";
import MainGrid from "./components/main-grid/MainGrid";
import MenuItemGameList from "./components/menu-item/menu-item-game-list/MenuItemGameList";
import TitleBar from "./components/title-bar/TitleBar";
import GamePageNavbar from "./components/game-page/game-page-navbar/GamePageNavbar";
import GamePageLoadingBar from "./components/game-page/game-page-loading-bar/GamePageLoadingBar";
import DiscordWidget from "./components/discord-widget/DiscordWidget";

function App() {
  return (
    <>
      <MainGrid>
        <TitleBar />
        <MenuItemGameList />
        <div className="game-page-view" name="./">
          <BannerImgAndLogo />
          <GamePageNavbar />
          <GamePageLoadingBar valuePercent={30} />
          <DiscordWidget inviteLink="https://discord.gg/unrealtournament" />
        </div>
      </MainGrid>
    </>
  );
}

export default App;
