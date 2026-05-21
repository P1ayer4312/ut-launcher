import "./SettingsDefaultButtons.scss";
import { FaFolderOpen, FaRegTrashAlt } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { logger } from "@src/frontend/utils/logger";

export default function SettingsDefaultButtons() {
  const selectedGame = useGlobalState((e) => e.selectedGame);
  const setModalData = useGlobalState((e) => e.setModalData);
  const localDataStore = useGlobalState((e) => e.localDataStore);
  const setLocalDataStore = useGlobalState((e) => e.setLocalDataStore);
  const setDownloadingGame = useGlobalState((e) => e.setDownloadingGame);
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
      <div className="settings-tab_header">Settings</div>
      <div className="settings-tab_button settings-tab_local-files" onClick={localFilesClicked}>
        <FaFolderOpen />
        <span>Local files</span>
      </div>
      <div
        className="settings-tab_button settings-tab_reinstall"
        onClick={() => {
          // The downloading steps should check if the files are already downloaded
          // and start the extraction process without redownload
          if (selectedGame === "blank" || !localData?.directory) {
            throw new Error(`Can't find the game install directory`);
          }

          logger.info(`Reinstalling game: ${selectedGame}`);
          setLocalDataStore({ [selectedGame]: { ...localData, installed: false } });

          Promise.all([
            contextBridge.gameData.set(selectedGame, { installed: false }),
            contextBridge.gameData.startGameDownload(selectedGame, localData.directory),
          ]).then(() => {
            setDownloadingGame(selectedGame);
          });
        }}
      >
        <TfiReload />
        <span>Reinstall</span>
      </div>
      <div className="settings-tab_button settings-tab_uninstall" onClick={uninstallClicked}>
        <FaRegTrashAlt />
        <span>Uninstall</span>
      </div>
    </div>
  );
}
