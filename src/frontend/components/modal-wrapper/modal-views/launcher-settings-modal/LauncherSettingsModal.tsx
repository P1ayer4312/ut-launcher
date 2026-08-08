import "./LauncherSettingsModal.scss";
import { useEffect, useState } from "react";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { useGlobalState } from "@src/frontend/state/useGlobalState";

export default function LauncherSettingsModal() {
  const setModalData = useGlobalState((e) => e.setModalData);
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    contextBridge.actionsHandler.appVersion().then(setVersion);
  }, []);

  return (
    <div className="launcher-settings-modal_container">
      <div className="launcher-settings-modal_header">Launcher Settings</div>
      <div
        className="launcher-settings-modal_link"
        onClick={() => contextBridge.actionsHandler.launcherSettingsAction("openAppData")}
      >
        Launcher Data
      </div>
      <div
        className="launcher-settings-modal_close"
        onClick={() => setModalData({ isOpened: false, modalType: "blank" })}
      >
        Close
      </div>
      <div className="launcher-settings-modal_text">App version: {version}</div>
      <div className="launcher-settings-modal_disclaimer">
        This project is not affiliated with Epic Games or the Unreal brand in any way.
      </div>
    </div>
  );
}
