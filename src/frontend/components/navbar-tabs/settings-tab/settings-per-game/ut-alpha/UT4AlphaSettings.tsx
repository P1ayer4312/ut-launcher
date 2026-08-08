import "./UT4AlphaSettings.scss";
import SettingsDefaultButtons from "@src/frontend/components/navbar-tabs/settings-tab/settings-default-buttons/SettingsDefaultButtons";
import SettingsPatch from "@src/frontend/components/navbar-tabs/settings-tab/settings-patch/SettingsPatch";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { FaScrewdriverWrench } from "react-icons/fa6";

export default function UT4AlphaSettings() {
  return (
    <div className="ut-1999-settings_container">
      <div>
        <SettingsDefaultButtons />
        <div
          className="settings-tab_button ut4-settings_button-drivers"
          onClick={() => contextBridge.actionsHandler.runScript("installDriversUT4")}
        >
          <FaScrewdriverWrench />
          Install drivers
        </div>
      </div>
      <div>
        <SettingsPatch />
      </div>
    </div>
  );
}
