import "./UT3Settings.scss";
import { FaKey } from "react-icons/fa";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import SettingsDefaultButtons from "@src/frontend/components/navbar-tabs/settings-tab/settings-default-buttons/SettingsDefaultButtons";

export default function UT3Settings() {
  return (
    <div className="ut3-settings_wrapper">
      <SettingsDefaultButtons />
      <div className="ut3-settings_buttons-wrapper">
        <div
          className="settings-tab_button ut3-settings_button-key"
          onClick={() => contextBridge.actionsHandler.runScript("replaceUT3EncryptedKey")}
        >
          <FaKey />
          Replace key
        </div>
      </div>
    </div>
  );
}
