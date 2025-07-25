import "./ModalWrapper.scss";
import Modal from "react-modal";
import { useGlobalState } from "../../state/useGlobalState";
import UninstallModal from "./modal-views/uninstall-modal/UninstallModal";

export default function ModalWrapper() {
	const { modalData, setModalData } = useGlobalState();

	function ModalViews() {
		switch (modalData.modalType) {
			case "uninstall":
				return <UninstallModal />;
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
			className={"modal_content"}
			overlayClassName={"modal_overlay"}
			onRequestClose={() => setModalData({ isOpened: false })}
		>
			<ModalViews />
		</Modal>
	);
}
