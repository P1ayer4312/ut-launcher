import "./UnrealSettings.scss";
import SettingsDefaultButtons from "@src/frontend/components/navbar-tabs/settings-tab/settings-default-buttons/SettingsDefaultButtons";
import SettingsPatch from "@src/frontend/components/navbar-tabs/settings-tab/settings-patch/SettingsPatch";

export default function UnrealSettings() {
  return (
    <div className="unreal-settings_container">
      <div>
        <SettingsDefaultButtons />
      </div>
      <div>
        <SettingsPatch />
      </div>
    </div>
  );
}
