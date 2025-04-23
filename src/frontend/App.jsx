import "./App.scss";
import BannerImgAndLogo from "./components/banner-img-and-logo/BannerImgAndLogo";
import MenuItemGameList from "./components/menu-item-game-list/MenuItemGameList";
import MenuItemGame from "./components/menu-item-game/MenuItemGame";

function App() {
  return (
    <>
      <div className="temp-wrapper">
        <MenuItemGameList />
        <BannerImgAndLogo />
      </div>
    </>
  );
}

export default App;
