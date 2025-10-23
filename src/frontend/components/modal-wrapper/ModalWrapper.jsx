import "./ModalWrapper.scss";
import Modal from "react-modal";
import { useGlobalState } from "../../state/useGlobalState";
import UninstallModal from "./modal-views/uninstall-modal/UninstallModal";
import ContinueModal from "./modal-views/continue-modal/ContinueModal";
import contextBridge from "../../contextBridge/contextBridge";
import ErrorModal from "./modal-views/error-modal/ErrorModal";

export default function ModalWrapper() {
	const { modalData, setModalData } = useGlobalState();

	function ModalViews() {
		switch (modalData.modalType) {
			case "uninstall":
				return <UninstallModal />;
			case "confirm":
				// TODO: Might need to refactor idk
				return (
					<ContinueModal
						onContinueClicked={() => {
							// TODO: Add logic
						}}
					>
						<div style={{ marginTop: "10px" }}>
							Adding a CD-Key to the registry is required for the game to run.
						</div>
						<div>Click on the "Continue" button to give permission to access the registry.</div>
						<div style={{ marginTop: "10px", marginBottom: "20px" }}>
							You can also do this action from the "Settings" tab.
						</div>
					</ContinueModal>
				);
			case "error":
				return <ErrorModal />;
			case "blank":
				return null;

			default:
				return <h3>UNDEFINED_MODAL_VIEW: {modalData.modalType}</h3>;
		}
	}

	return (
		<Modal
			isOpen={modalData.isOpened}
			ariaHideApp={false}
			className={`modal_content modal_content_${modalData.modalType}`}
			overlayClassName={"modal_overlay"}
			onRequestClose={() => setModalData({ isOpened: false })}
		>
			<ModalViews />
		</Modal>
	);
}
