import contextBridge from "../../../contextBridge/contextBridge";
import { useGlobalState } from "../../../state/useGlobalState";
import ContinueModal from "./continue-modal/ContinueModal";

export default function ContinueModalWrapper() {
	const { setModalData } = useGlobalState();

	return (
		<ContinueModal
			onContinueClicked={() => {
				setModalData({ isOpened: false, modalType: "" });
				contextBridge.actionsHandler.registerGameKey("u");
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
}
