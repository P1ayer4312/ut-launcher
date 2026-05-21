import "./SettingsTab.scss";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import UnrealSettings from "@src/frontend/components/navbar-tabs/settings-tab/settings-per-game/unreal/UnrealSettings";
import UT1999Settings from "@src/frontend/components/navbar-tabs/settings-tab/settings-per-game/ut-1999/UT1999Settings";
import Unreal2Settings from "@src/frontend/components/navbar-tabs/settings-tab/settings-per-game/unreal-2/Unreal2Settings";
import UT2003Settings from "@src/frontend/components/navbar-tabs/settings-tab/settings-per-game/ut-2003/UT2003Settings";
import UT2004Settings from "@src/frontend/components/navbar-tabs/settings-tab/settings-per-game/ut-2004/UT2004Settings";
import UT3Settings from "@src/frontend/components/navbar-tabs/settings-tab/settings-per-game/ut-3/UT3Settings";
import UT4AlphaSettings from "@src/frontend/components/navbar-tabs/settings-tab/settings-per-game/ut-alpha/UT4AlphaSettings";

export default function SettingsTab() {
  const { selectedGame, localDataStore } = useGlobalState();
  const localData = localDataStore[selectedGame];

  return (
    <div className="settings-tab">
      <div className="settings-tab_general">{localData?.installed && <SettingsPerGame />}</div>
    </div>
  );
}

/** Helper component that returns settings controls based on selected game */
function SettingsPerGame() {
  const { selectedGame } = useGlobalState();

  switch (selectedGame) {
    case "unreal":
      return <UnrealSettings />;

    case "ut-1999":
      return <UT1999Settings />;

    case "unreal-2":
      return <Unreal2Settings />;

    case "ut-2003":
      return <UT2003Settings />;

    case "ut-2004":
      return <UT2004Settings />;

    case "ut-3":
      return <UT3Settings />;

    case "ut-alpha":
      return <UT4AlphaSettings />;

    default:
      return `UNDEFINED_SETTINGS_VIEW: ${selectedGame}`;
  }
}
