import { useGlobalState } from "@src/frontend/state/useGlobalState";
import "./ModalWrapper.scss";
import Modal from "react-modal";
import UninstallModal from "./modal-views/uninstall-modal/UninstallModal";
import ContinueModal from "./modal-views/continue-modal/ContinueModal";
import ErrorModal from "./modal-views/error-modal/ErrorModal";
import contextBridge from "@src/frontend/contextBridge/contextBridge";
import { logger } from "@src/frontend/utils/logger";

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

  switch (modalData.modalType) {
    case "uninstall":
      return <UninstallModal />;
    case "continue": {
      // There are not many modals that required the user's interaction, so for now we'll configure
      // them here, if needed in the future they can be abstracted in different files
      if (modalData.continueModalVariant !== "message-block") {
        contextBridge.actionsHandler.flashFrame(true);
      }

      switch (modalData.continueModalVariant) {
        case "message-block": {
          return (
            <ContinueModal showButton={false}>
              <div>{modalData.continueModalText}</div>
            </ContinueModal>
          );
        }
        case "empty":
          return (
            <ContinueModal
              onButtonClicked={() => {
                // TODO: Add logic
                setModalData({ isOpened: false });
                contextBridge.actionsHandler.flashFrame(false);
              }}
            >
              <div style={{ marginTop: "10px" }}>
                Adding a CD-Key to the registry is required for the game to run.
              </div>
              <div>{`Click on the "Continue" button to give permission to access the registry.`}</div>
              <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                {`You can also do this action from the "Settings" tab.`}
              </div>
            </ContinueModal>
          );
        default:
          return (
            <ContinueModal onButtonClicked={() => setModalData({ isOpened: false })}>
              <div>{`MISCONFIGURED_CONTINUE_MODAL: ${selectedGame}`}</div>
            </ContinueModal>
          );
      }
    }
    case "error":
      return <ErrorModal />;
    case "blank":
      return null;

    default:
      return <h3>UNDEFINED_MODAL_VIEW: {modalData.modalType}</h3>;
  }
}
