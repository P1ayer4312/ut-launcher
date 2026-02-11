import "./App.scss";
import MenuItemGameList from "@src/frontend/components/menu-item/menu-item-game-list/MenuItemGameList";
import TitleBar from "@src/frontend/components/title-bar/TitleBar";

export default function App() {
  return (
    <>
      <TitleBar />
      <div className="main-grid">
        <MenuItemGameList />
      </div>
    </>
  );
}
