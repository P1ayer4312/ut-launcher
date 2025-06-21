import { useState } from "react";
import { useGlobalState } from "../../../../state/useGlobalState";
import GamePageNavbar from "../../game-page-navbar/GamePageNavbar";
import GamePageLoadingBar from "../../game-page-loading-bar/GamePageLoadingBar";
import Home from "./tab-views/home/Home";
import Community from "./tab-views/community/Community";
import Guides from "./tab-views/guides/Guides";

export default function UT4AlphaView() {
  const { downloadingGame, selectedGame } = useGlobalState();
  const [activeTab, setActiveTab] = useState("home");

  function getTabView(activeTab) {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "community":
        return <Community />;
      case "guides":
        return <Guides />;
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
        <div className="game-page-navbar_button" onClick={() => setActiveTab("community")}>
          Community
        </div>
        <div className="game-page-navbar_button" onClick={() => setActiveTab("guides")}>
          Guides
        </div>
      </GamePageNavbar>
      {selectedGame == downloadingGame && <GamePageLoadingBar valuePercent={22} />}
      {getTabView(activeTab)}
    </>
  );
}
