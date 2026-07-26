import "./UT3Settings.scss";
import { FaKey } from "react-icons/fa";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import SettingsDefaultButtons from "@src/frontend/components/navbar-tabs/settings-tab/settings-default-buttons/SettingsDefaultButtons";
import { useGlobalState } from "@src/frontend/state/useGlobalState";

export default function UT3Settings() {
  const setModalData = useGlobalState((e) => e.setModalData);

  return (
    <div>
      <SettingsDefaultButtons />
      <div
        className="settings-tab_button ut3-settings_button-key"
        onClick={() => contextBridge.actionsHandler.runScript("replaceUT3EncryptedKey")}
      >
        <FaKey />
        Replace key
      </div>
      <div
        className="settings-tab_button ut3-settings_button-key"
        onClick={() => setModalData({ isOpened: true, continueModalVariant: "ut3-key" })}
      >
        <FaKey />
        Manual key insert
      </div>
    </div>
  );
}
