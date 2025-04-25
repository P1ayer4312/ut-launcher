import "./App.scss";
import BannerImgAndLogo from "./components/banner-img-and-logo/BannerImgAndLogo";
import MainGrid from "./components/main-grid/MainGrid";
import MenuItemGameList from "./components/menu-item-game-list/MenuItemGameList";
import TitleBar from "./components/title-bar/TitleBar";

function App() {
  return (
    <>
      <MainGrid>
        <TitleBar />
        <MenuItemGameList />
        <BannerImgAndLogo />
      </MainGrid>
    </>
  );
}

export default App;
