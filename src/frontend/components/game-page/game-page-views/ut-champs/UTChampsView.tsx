import { useState } from "react";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import GamePageNavbar from "@src/frontend/components/game-page/game-page-navbar/GamePageNavbar";
import GamePageLoadingBar from "@src/frontend/components/game-page/game-page-loading-bar/GamePageLoadingBar";
import Home from "./tab-views/home/Home";

type Tabs = "home";

export default function UTChampsView() {
  const { downloadingGame, selectedGame } = useGlobalState();
  const [activeTab, setActiveTab] = useState<Tabs>("home");

  return (
    <>
      <GamePageNavbar unavailable={true}>
        <div className="game-page-navbar_button" onClick={() => setActiveTab("home")}>
          Home
        </div>
      </GamePageNavbar>
      {selectedGame == downloadingGame && <GamePageLoadingBar />}
      <GetTabView activeTab={activeTab} />
    </>
  );
}

function GetTabView(props: { activeTab: Tabs }) {
  switch (props.activeTab) {
    case "home":
      return <Home />;
    default:
      return null;
  }
}
