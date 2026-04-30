import "./UT1999Settings.scss";
import SettingsDefaultButtons from "@src/frontend/components/navbar-tabs/settings-tab/settings-default-buttons/SettingsDefaultButtons";
import SettingsPatch from "@src/frontend/components/navbar-tabs/settings-tab/settings-patch/SettingsPatch";

export default function UT1999Settings() {
  return (
    <div className="ut-1999-settings_container">
      <div>
        <SettingsDefaultButtons />
      </div>
      <div>
        <SettingsPatch />
      </div>
    </div>
  );
}
