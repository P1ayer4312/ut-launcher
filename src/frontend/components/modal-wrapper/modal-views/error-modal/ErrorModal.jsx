import "./ErrorModal.scss";
import { BiError } from "react-icons/bi";
import { RiCloseLargeLine } from "react-icons/ri";
import { useGlobalState } from "../../../../state/useGlobalState";
import contextBridge from "../../../../contextBridge/contextBridge";

export default function ErrorModal() {
	const { setModalData, setDownloadingGame, modalData, downloadingGame } = useGlobalState();

	function onCloseClicked() {
		setModalData({ isOpened: false, modalType: "blank" });
		if (downloadingGame) {
			contextBridge.gameData.stopGameDownload(downloadingGame).then(() => setDownloadingGame(null));
		}
	}

	return (
		<div className="error-modal_wrapper">
			<div className="error-modal_title">
				<BiError style={{ fontSize: "30px" }} />
				<span className="error-modal_title-text">Error occurred</span>
			</div>
			<div className="error-modal_message">{modalData.errorModalText || "Unknown error occurred"}</div>
			<div className="error-modal_button" onClick={onCloseClicked}>
				<RiCloseLargeLine />
				<span>Close</span>
			</div>
		</div>
	);
}
