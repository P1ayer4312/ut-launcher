import "./SettingsTab.scss";
import { FaFolderOpen, FaRegTrashAlt } from "react-icons/fa";
import { useGlobalState } from "../../../state/useGlobalState";
import contextBridge from "../../../contextBridge/contextBridge";

/**
 * @typedef {object} SettingTabProps
 * @prop {boolean} unavailable Game is unavailable to download
 * @prop {boolean} stop Stop the current download process
 *
 * @param {SettingTabProps & React.PropsWithChildren} props
 */
export default function SettingsTab(props) {
	const { selectedGame, localDataStore, setModalData } = useGlobalState();
	const localData = localDataStore[selectedGame];

	function localFilesClicked() {
		contextBridge.actionsHandler.open(localData.directory);
	}

	function uninstallClicked() {
		setModalData({ isOpened: true, modalType: "uninstall" });
	}

	return (
		<div className="settings-tab">
			<h3 className="settings-tab_header">Settings</h3>
			{localData.installed && (
				<div className="settings-tab_local-buttons">
					<div className="settings-tab_button settings-tab_local-files" onClick={localFilesClicked}>
						<FaFolderOpen />
						<span>Local files</span>
					</div>
					<div className="settings-tab_button settings-tab_uninstall" onClick={uninstallClicked}>
						<FaRegTrashAlt />
						<span>Uninstall</span>
					</div>
				</div>
			)}
			{props.children}
		</div>
	);
}
