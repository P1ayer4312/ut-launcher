import { useEffect, useState } from "react";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import GamePageNavbar from "@src/frontend/components/game-page/game-page-navbar/GamePageNavbar";
import GamePageLoadingBar from "@src/frontend/components/game-page/game-page-loading-bar/GamePageLoadingBar";
import ScreenshotsTab from "@src/frontend/components/navbar-tabs/screenshots-tab/ScreenshotsTab";
import SettingsTab from "@src/frontend/components/navbar-tabs/settings-tab/SettingsTab";
import Community from "@src/frontend/components/game-page/community/Community";
import Home from "./tab-views/home/Home";

type Tabs = "home" | "settings" | "screenshots" | "community";

export default function UT1999View() {
  const downloadingGame = useGlobalState((e) => e.downloadingGame);
  const selectedGame = useGlobalState((e) => e.selectedGame);
  const localDataStore = useGlobalState((e) => e.localDataStore);
  const [activeTab, setActiveTab] = useState<Tabs>("home");
  const [installed, setInstalled] = useState<boolean>(Boolean(localDataStore[selectedGame]?.installed));

  useEffect(() => {
    // Redirect the user to the home page after uninstalling the game
    if (selectedGame !== "blank") {
      const installCheck = Boolean(localDataStore[selectedGame]?.installed);
      setInstalled(installCheck);

      if (!installCheck) {
        setActiveTab("home");
      }
    }
  }, [localDataStore]);

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
    case "screenshots":
      return <ScreenshotsTab />;
    case "community":
      return <Community />;
    case "settings":
      return <SettingsTab />;
    default:
      return null;
  }
}
