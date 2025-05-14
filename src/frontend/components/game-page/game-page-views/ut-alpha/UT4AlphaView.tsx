import { useState } from "react";
import GamePageNavbar from "../../game-page-navbar/GamePageNavbar";
import Community from "./tab-views/community/Community";
import Guides from "./tab-views/guides/Guides";
import { useGlobalState } from "../../../../state/useGlobalState";
import GamePageLoadingBar from "../../game-page-loading-bar/GamePageLoadingBar";

export default function UT4AlphaView() {
  const { downloadingGame, selectedGame } = useGlobalState();
  const [activeTab, setActiveTab] = useState("");

  function getTabView(activeTab) {
    switch (activeTab) {
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
