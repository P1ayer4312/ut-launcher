import "./SettingsDefaultButtons.scss";
import { FaFolderOpen, FaRegTrashAlt } from "react-icons/fa";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import contextBridge from "@src/frontend/contextBridge/contextBridge";

export default function SettingsDefaultButtons() {
  const { selectedGame, localDataStore, setModalData } = useGlobalState();
  const localData = localDataStore[selectedGame];

  function localFilesClicked() {
    if (localData?.directory) {
      contextBridge.actionsHandler.open(localData!.directory);
    } else {
      throw new Error("Unable to open the local directory");
    }
  }

  function uninstallClicked() {
    setModalData({ isOpened: true, modalType: "uninstall" });
  }

  return (
    <div className="settings-tab_local-buttons">
      <div className="settings-tab_button settings-tab_local-files" onClick={localFilesClicked}>
        <FaFolderOpen />
        <span>Local files</span>
      </div>
      <div className="settings-tab_button settings-tab_uninstall" onClick={uninstallClicked}>
        <FaRegTrashAlt />
        <span>Uninstall</span>
      </div>
    </div>
  );
}
