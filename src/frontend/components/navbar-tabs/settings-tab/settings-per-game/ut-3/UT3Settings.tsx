import contextBridge from "@src/frontend/contextBridge/contextBridge";
import "./UT3Settings.scss";
import SettingsDefaultButtons from "@src/frontend/components/navbar-tabs/settings-tab/settings-default-buttons/SettingsDefaultButtons";

export default function UT3Settings() {
  return (
    <div>
      <SettingsDefaultButtons />
      <button onClick={() => contextBridge.actionsHandler.runScript("replaceUT3EncryptedKey")}>
        Replace key
      </button>
    </div>
  );
}
