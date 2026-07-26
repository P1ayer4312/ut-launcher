import "./ModalWrapper.scss";
import Modal from "react-modal";
import { useState } from "react";
import { FaKey } from "react-icons/fa";
import UninstallModal from "./modal-views/uninstall-modal/UninstallModal";
import ContinueModal from "./modal-views/continue-modal/ContinueModal";
import ErrorModal from "./modal-views/error-modal/ErrorModal";
import { logger } from "@src/frontend/utils/logger";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import LauncherSettingsModal from "@src/frontend/components/modal-wrapper/modal-views/launcher-settings-modal/LauncherSettingsModal";

export default function ModalWrapper() {
  const modalData = useGlobalState((e) => e.modalData);
  const setModalData = useGlobalState((e) => e.setModalData);

  return (
    <Modal
      isOpen={modalData.isOpened}
      ariaHideApp={false}
      className={`modal_content modal_content_${modalData.modalType}`}
      overlayClassName={"modal_overlay"}
      onRequestClose={() => {
        if (modalData.modalType === "continue") {
          // Disable closing the modal by clicking on the sides
          return;
        }

        setModalData({ isOpened: false });
      }}
    >
      {/* Modal opened check added to resolve rerender issue */}
      {modalData.isOpened && <ModalViews />}
    </Modal>
  );
}

function ModalViews() {
  const modalData = useGlobalState((e) => e.modalData);
  const setModalData = useGlobalState((e) => e.setModalData);
  const selectedGame = useGlobalState((e) => e.selectedGame);
  logger.info(`Modal type: "${modalData.modalType}" | Modal variant: "${modalData.continueModalVariant}"`);

  // Logic for the UT3 key reveal
  const [showKey, setShowKey] = useState<boolean>(false);
  const [key, setKey] = useState<string>("----");

  function closeModal() {
    setModalData({ isOpened: false });
    contextBridge.actionsHandler.flashFrame(false);
  }

  switch (modalData.modalType) {
    case "uninstall":
      return <UninstallModal />;
    case "continue": {
      // There are not many modals that required the user's interaction, so for now we'll configure
      // them here, if needed in the future they can be abstracted in different files
      if (modalData.continueModalVariant !== "message-block" && showKey === false) {
        contextBridge.actionsHandler.flashFrame(true);
      }

      switch (modalData.continueModalVariant) {
        // =====================================================================================================================
        case "message-block": {
          return (
            <ContinueModal showButton={false}>
              <div>{modalData.continueModalText}</div>
            </ContinueModal>
          );
        }
        // =====================================================================================================================
        case "ut-2003-register-key": {
          return (
            <ContinueModal
              onButtonClicked={() => {
                closeModal();
                contextBridge.actionsHandler.runScript("registerUT2003key");
              }}
            >
              <div style={{ marginTop: "10px" }}>
                {`Adding a CD-Key to the registry is required for the game to run.`}
              </div>
              <div>{`Click on the "Continue" button to give permission to access the registry.`}</div>
              <div style={{ marginTop: "10px" }}>
                {`You can also do this action from the "Settings" tab.`}
              </div>
              <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                {`Resolution and other tweaks are available in the settings tab.`}
              </div>
            </ContinueModal>
          );
        }
        // =====================================================================================================================
        case "ut-2004-install-message": {
          return (
            <ContinueModal
              onButtonClicked={() => {
                closeModal();
              }}
            >
              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                {`Patches from OldUnreal are not applied automatically, they can be downloaded from the "Settings" tab.`}
              </div>
              <div
                style={{ marginBottom: "10px" }}
              >{`Some servers might require a CD-Key, you can register one from the "Settings" tab.`}</div>
              <div style={{ marginBottom: "10px" }}>
                {`Additional game settings are also available in the same tab.`}
              </div>
            </ContinueModal>
          );
        }
        // =====================================================================================================================
        case "ut-alpha-install-message": {
          return (
            <ContinueModal
              onButtonClicked={() => {
                closeModal();
                contextBridge.actionsHandler.runScript("installDriversUT4");
              }}
            >
              <div style={{ marginTop: "10px" }}>
                {`DirectX and Visual C++ Redist are required for playing the game.`}
              </div>
              <div>{`Click on the "Continue" button to give permission to install them.`}</div>
              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                {`Patches are installed automatically but can be changed from the "Settings tab."`}
              </div>
            </ContinueModal>
          );
        }
        // =====================================================================================================================
        case "ut3-key": {
          // I'm starting to get a bit sloppy with the code structure :/
          return (
            <ContinueModal
              onButtonClicked={() => {
                closeModal();
              }}
              buttonText="Close"
            >
              <div className="modal_ut3-key_text">
                <div>{`Registering a product key might be required if the`}</div>
                <div>{`automated script failed to create one after install.`}</div>
                <div>{`Click on the "Reveal Key" button to get a product key.`}</div>
              </div>

              <div className="modal_ut3-key_reveal-section">
                {showKey ? (
                  <>
                    <div className="modal_ut3-key_show">
                      <div>{key}</div>
                      <div
                        onClick={() => {
                          contextBridge.gameData.getProductKey("ut-3").then(setKey);
                        }}
                        className="modal_ut3-key_reveal-button"
                      >
                        <FaKey />
                        New Key
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="modal_ut3-key_reveal-button"
                      onClick={() => {
                        contextBridge.gameData.getProductKey("ut-3").then(setKey);
                        setShowKey(true);
                      }}
                    >
                      <FaKey />
                      Reveal Key
                    </div>
                  </>
                )}
              </div>
            </ContinueModal>
          );
        }
        // =====================================================================================================================
        default:
          return (
            <ContinueModal
              onButtonClicked={() => {
                closeModal();
              }}
            >
              <div>{`MISCONFIGURED_CONTINUE_MODAL: ${selectedGame}`}</div>
            </ContinueModal>
          );
      }
    }
    case "error":
      return <ErrorModal />;
    case "launcher-settings":
      return <LauncherSettingsModal />;
    case "blank":
      return null;

    default:
      return <h3>UNDEFINED_MODAL_VIEW: {modalData.modalType}</h3>;
  }
}
