/** @import { TGameId } from "../../state/useGlobalState" */
import { useState, createContext, useEffect } from "react";
import "./CreateServerWrapper.scss";
import ServerSettingsUnreal from "./game-settings/unreal/ServerSettingsUnreal";
import contextBridge from "../../contextBridge/contextBridge";

const CreateServerContext = createContext(null);

/** @param {TGameId} gameId */
export default function CreateServerWrapper(gameId) {
	const [serverData, setServerData] = useState(null);

	useEffect(() => {
		contextBridge.gameData.readServerIni("unreal").then(setServerData);
	}, [setServerData]);

	return (
		<CreateServerContext value={[serverData, setServerData]}>
			<div className="create-server">
				<div className="create-server_title-bar">
					<span>Start network game</span>
				</div>
				<div className="create-server_content">
					{!serverData ? (
						<div className="create-server_tab-options">Loading...</div>
					) : (
						<ServerSettingsUnreal context={CreateServerContext} />
					)}
					<div className="create-server_footer">
						<div
							className="create-server_start-server"
							onClick={() => contextBridge.gameData.saveServerIni("unreal", serverData)}
						>
							<span>Start server</span>
						</div>
					</div>
				</div>
			</div>
		</CreateServerContext>
	);
}
