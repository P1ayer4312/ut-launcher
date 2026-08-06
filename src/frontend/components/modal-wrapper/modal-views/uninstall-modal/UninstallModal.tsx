import { FaCheck, FaCat } from "react-icons/fa";
import "./UninstallModal.scss";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { logger } from "@src/frontend/utils/logger";

type Props = {
  reinstall: boolean;
};

export default function UninstallModal(props: Props) {
  const setDownloadingGame = useGlobalState((e) => e.setDownloadingGame);
  const setLocalDataStore = useGlobalState((e) => e.setLocalDataStore);
  const setModalData = useGlobalState((e) => e.setModalData);
  const selectedGame = useGlobalState((e) => e.selectedGame);
  const localData = useGlobalState((state) => state.localDataStore[state.selectedGame]);

  if (props.reinstall) {
    return (
      <div className="uninstall-modal">
        <h3>Are you sure you want to reinstall this game?</h3>
        <div className="uninstall-modal_text">
          <div>This action removes all games files but leaves the install files.</div>
          <div>Stopping the reinstall process will remove every file related to</div>
          <div>the game. Do you wish to proceed ?</div>
        </div>
        <div className="uninstall-modal_controls">
          <div
            className="uninstall-modal_button uninstall-modal_yes"
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
                setModalData({ isOpened: false });
                setDownloadingGame(selectedGame);
              });
            }}
          >
            <FaCheck />
            <span>Yes</span>
          </div>
          <div
            className="uninstall-modal_button uninstall-modal_no"
            onClick={() => setModalData({ isOpened: false })}
          >
            <FaCat />
            <span>No</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="uninstall-modal">
      <h3>Are you sure you want to uninstall this game?</h3>
      <div className="uninstall-modal_text">
        This action will remove all game files and screenshots from your local disk
      </div>
      <div className="uninstall-modal_controls">
        <div
          className="uninstall-modal_button uninstall-modal_yes"
          onClick={() => {
            if (selectedGame !== "blank") {
              contextBridge.gameData.uninstallGame(selectedGame);
            }
          }}
        >
          <FaCheck />
          <span>Yes</span>
        </div>
        <div
          className="uninstall-modal_button uninstall-modal_no"
          onClick={() => setModalData({ isOpened: false })}
        >
          <FaCat />
          <span>No</span>
        </div>
      </div>
    </div>
  );
}
