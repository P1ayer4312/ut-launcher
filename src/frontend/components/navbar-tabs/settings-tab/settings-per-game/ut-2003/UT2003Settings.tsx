import "./UT2003Settings.scss";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import SettingsDefaultButtons from "@src/frontend/components/navbar-tabs/settings-tab/settings-default-buttons/SettingsDefaultButtons";
import { FaKey } from "react-icons/fa";
import SettingsGameOptions from "@src/frontend/components/navbar-tabs/settings-tab/settings-game-options/SettingsGameOptions";

export default function UT2003Settings() {
  return (
    <div className="ut-2003-settings_container">
      <div>
        <SettingsDefaultButtons />
        <div
          className="settings-tab_button ut-2003-settings_button-key"
          onClick={() => contextBridge.actionsHandler.runScript("registerUT2003key")}
        >
          <FaKey />
          Register key
        </div>
      </div>
      <div>
        <SettingsGameOptions />
      </div>
    </div>
  );
}
