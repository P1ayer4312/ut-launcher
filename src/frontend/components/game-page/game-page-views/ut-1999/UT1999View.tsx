import { useState } from "react";
import { useGlobalState } from "../../../../state/useGlobalState";
import GamePageNavbar from "../../game-page-navbar/GamePageNavbar";
import GamePageLoadingBar from "../../game-page-loading-bar/GamePageLoadingBar";
import Home from "./tab-views/home/Home";

export default function UT1999View() {
  const { downloadingGame, selectedGame } = useGlobalState();
  const [activeTab, setActiveTab] = useState("home");

  function getTabView(activeTab) {
    switch (activeTab) {
      case "home":
        return <Home />;
      default:
        return null;
    }
  }

  return (
    <>
      <GamePageNavbar>
        <div className="game-page-navbar_button" onClick={() => setActiveTab("home")}>
          Home
        </div>
      </GamePageNavbar>
      {selectedGame == downloadingGame && <GamePageLoadingBar valuePercent={22} />}
      {getTabView(activeTab)}
    </>
  );
}
