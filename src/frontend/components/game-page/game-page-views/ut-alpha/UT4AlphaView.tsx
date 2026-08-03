import { useEffect, useState } from "react";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import GamePageNavbar from "@src/frontend/components/game-page/game-page-navbar/GamePageNavbar";
import GamePageLoadingBar from "@src/frontend/components/game-page/game-page-loading-bar/GamePageLoadingBar";
import SettingsTab from "@src/frontend/components/navbar-tabs/settings-tab/SettingsTab";
import Community from "@src/frontend/components/game-page/community/Community";
import Guides from "./tab-views/guides/Guides";
import Home from "./tab-views/home/Home";
import Screenshots from "@src/frontend/components/navbar-tabs/screenshots-tab/ScreenshotsTab";

type Tabs = "home" | "settings" | "guides" | "community" | "screenshots";

export default function UT4AlphaView() {
  const downloadingGame = useGlobalState((e) => e.downloadingGame);
  const selectedGame = useGlobalState((e) => e.selectedGame);
  const setModalData = useGlobalState((e) => e.setModalData);
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
        <div
          className="game-page-navbar_button"
          onClick={() => setModalData({ modalType: "guide", isOpened: true })}
        >
          How To Play
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
    case "community":
      return <Community />;
    case "guides":
      return <Guides />;
    case "settings":
      return <SettingsTab />;
    case "screenshots":
      return <Screenshots />;
    default:
      return null;
  }
}
