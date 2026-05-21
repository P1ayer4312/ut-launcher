import "./UT2003Settings.scss";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import SettingsDefaultButtons from "@src/frontend/components/navbar-tabs/settings-tab/settings-default-buttons/SettingsDefaultButtons";
import { FaKey } from "react-icons/fa";

export default function UT2003Settings() {
  return (
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
  );
}
