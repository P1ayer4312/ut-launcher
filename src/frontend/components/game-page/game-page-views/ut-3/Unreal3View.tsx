import { useState } from "react";
import GamePageNavbar from "@src/frontend/components/game-page/game-page-navbar/GamePageNavbar";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import GamePageLoadingBar from "@src/frontend/components/game-page/game-page-loading-bar/GamePageLoadingBar";
import SettingsTab from "@src/frontend/components/navbar-tabs/settings-tab/SettingsTab";
import Home from "./tab-views/home/Home";

type Tabs = "home" | "settings";

export default function UT4AlphaView() {
  const { downloadingGame, selectedGame } = useGlobalState();
  const [activeTab, setActiveTab] = useState<Tabs>("home");

  return (
    <>
      <GamePageNavbar>
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
    case "settings":
      return <SettingsTab />;
    default:
      return null;
  }
}
