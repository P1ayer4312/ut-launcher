import "./App.scss";
import BannerImgAndLogo from "./components/banner-img-and-logo/BannerImgAndLogo";
import MainGrid from "./components/main-grid/MainGrid";
import MenuItemGameList from "./components/menu-item/menu-item-game-list/MenuItemGameList";
import TitleBar from "./components/title-bar/TitleBar";
import GamePageNavbar from "./components/game-page/game-page-navbar/GamePageNavbar";
import GamePageLoadingBar from "./components/game-page/game-page-loading-bar/GamePageLoadingBar";
import { useEffect, useRef, useState } from "react";
import DiscordWidget from "./components/discord-widget/DiscordWidget";

function App() {
  // const [progress, setProgress] = useState(0);
  // const [intervalRef, setIntervalRef] = useState(0);

  // useEffect(() => {
  //   setIntervalRef(
  //     setInterval(() => {
  //       if (progress >= 100) {
  //         clearInterval(intervalRef);
  //       } else {
  //         setProgress((value) => value + 10);
  //       }
  //     }, 1000)
  //   );

  //   return () => clearInterval(intervalRef);
  // }, []);

  return (
    <>
      <MainGrid>
        <TitleBar />
        <MenuItemGameList />
        <div className="game-page-view" name="./">
          <BannerImgAndLogo />
          <GamePageNavbar />
          <GamePageLoadingBar valuePercent={30} />
          <DiscordWidget />
        </div>
      </MainGrid>
    </>
  );
}

export default App;
