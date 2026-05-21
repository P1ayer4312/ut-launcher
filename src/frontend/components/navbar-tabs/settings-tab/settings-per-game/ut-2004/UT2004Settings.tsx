import "./UT2004Settings.scss";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import SettingsDefaultButtons from "@src/frontend/components/navbar-tabs/settings-tab/settings-default-buttons/SettingsDefaultButtons";
import { FaKey } from "react-icons/fa";
import SettingsPatch from "@src/frontend/components/navbar-tabs/settings-tab/settings-patch/SettingsPatch";
import SettingsGameOptions from "@src/frontend/components/navbar-tabs/settings-tab/settings-game-options/SettingsGameOptions";

export default function UT2004Settings() {
  return (
    <div className="ut-2004-settings_container">
      <div>
        <SettingsDefaultButtons />
        <div
          className="settings-tab_button ut-2004-settings_button-key"
          onClick={() => contextBridge.actionsHandler.runScript("registerUT2004key")}
        >
          <FaKey />
          Register key
        </div>
      </div>
      <div>
        <SettingsPatch />
      </div>
      <div>
        <SettingsGameOptions />
      </div>
    </div>
  );
}
