import { useEffect, useState } from "react";
import { useGlobalState } from "../../../../state/useGlobalState";
import GamePageNavbar from "../../game-page-navbar/GamePageNavbar";
import GamePageLoadingBar from "../../game-page-loading-bar/GamePageLoadingBar";
import Home from "./tab-views/home/Home";
import Screenshots from "../../../screenshots/Screenshots";
import Community from "./tab-views/community/Community";
import contextBridge from "../../../../contextBridge/contextBridge";

export default function UT1999View() {
  const { downloadingGame, selectedGame } = useGlobalState();
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    contextBridge.gameData.get("ut-1999");
  }, []);

  function getTabView(activeTab) {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "screenshots":
        return <Screenshots />;
      case "community":
        return <Community />;
      default:
        return null;
    }
  }

  return (
    <>
      <GamePageNavbar unavailable={false} stop={false}>
        <div className="game-page-navbar_button" onClick={() => setActiveTab("home")}>
          Home
        </div>
        <div className="game-page-navbar_button" onClick={() => setActiveTab("community")}>
          Community
        </div>
        <div className="game-page-navbar_button" onClick={() => setActiveTab("screenshots")}>
          Screenshots
        </div>
      </GamePageNavbar>
      {selectedGame == downloadingGame && <GamePageLoadingBar />}
      {getTabView(activeTab)}
    </>
  );
}
