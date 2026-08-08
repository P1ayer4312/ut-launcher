import "./SettingsDefaultButtons.scss";
import { FaFolderOpen, FaRegTrashAlt } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { logger } from "@src/frontend/utils/logger";

export default function SettingsDefaultButtons() {
  const selectedGame = useGlobalState((e) => e.selectedGame);
  const setModalData = useGlobalState((e) => e.setModalData);
  const localData = useGlobalState((state) => state.localDataStore[state.selectedGame]);
  const isOtherGameActive = useGlobalState((e) => e.isOtherGameActive);

  function localFilesClicked() {
    if (localData?.directory) {
      contextBridge.actionsHandler.open(localData!.directory, selectedGame);
    } else {
      throw new Error("Unable to open the local directory");
    }
  }

  return (
    <div className="settings-tab_local-buttons">
      <div className="settings-tab_header">Settings</div>
      <div className="settings-tab_button settings-tab_local-files" onClick={localFilesClicked}>
        <FaFolderOpen />
        <span>Local files</span>
      </div>
      <div
        className="settings-tab_button settings-tab_reinstall"
        onClick={() => {
          if (isOtherGameActive()) {
            // Disable the Reinstall button if another game is being worked on,
            // or the same selected game is being played
            logger.info("REINSTALL button disabled, game activity present");
            return;
          }

          setModalData({ isOpened: true, modalType: "reinstall" });
        }}
      >
        <TfiReload />
        <span>Reinstall</span>
      </div>
      <div
        className="settings-tab_button settings-tab_uninstall"
        onClick={() => {
          setModalData({ isOpened: true, modalType: "uninstall" });
        }}
      >
        <FaRegTrashAlt />
        <span>Uninstall</span>
      </div>
    </div>
  );
}
