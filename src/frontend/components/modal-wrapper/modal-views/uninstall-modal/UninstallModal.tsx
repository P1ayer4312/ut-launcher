import { FaCheck, FaCat } from "react-icons/fa";
import "./UninstallModal.scss";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import contextBridge from "@src/frontend/contextBridge/contextBridge";

export default function UninstallModal() {
  const { setModalData, selectedGame } = useGlobalState();

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
