import { useEffect, useState } from "react";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import GamePageLoadingBar from "@src/frontend/components/game-page/game-page-loading-bar/GamePageLoadingBar";
import GamePageNavbar from "@src/frontend/components/game-page/game-page-navbar/GamePageNavbar";
import SettingsTab from "@src/frontend/components/navbar-tabs/settings-tab/SettingsTab";
import Home from "./tab-views/home/Home";
import Screenshots from "@src/frontend/components/navbar-tabs/screenshots-tab/ScreenshotsTab";
import Community from "@src/frontend/components/game-page/community/Community";

type Tabs = "home" | "settings" | "screenshots" | "community";

export default function UT2004View() {
  const downloadingGame = useGlobalState((e) => e.downloadingGame);
  const selectedGame = useGlobalState((e) => e.selectedGame);
  const installed = useGlobalState((state) => Boolean(state.localDataStore[state.selectedGame]?.installed));
  const [activeTab, setActiveTab] = useState<Tabs>("home");

  useEffect(() => {
    // Redirect the user to the home page after uninstalling the game
    if (!installed) {
      setActiveTab("home");
    }
  }, [installed]);

  return (
    <>
      <GamePageNavbar>
        <div className="game-page-navbar_button" onClick={() => setActiveTab("home")}>
          Home
        </div>
        <div className="game-page-navbar_button" onClick={() => setActiveTab("community")}>
          Community
        </div>
        {installed && (
          <>
            <div className="game-page-navbar_button" onClick={() => setActiveTab("screenshots")}>
              Screenshots
            </div>
            <div className="game-page-navbar_button" onClick={() => setActiveTab("settings")}>
              Settings
            </div>
          </>
        )}
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
    case "screenshots":
      return <Screenshots />;
    case "community":
      return <Community />;
    default:
      return null;
  }
}
