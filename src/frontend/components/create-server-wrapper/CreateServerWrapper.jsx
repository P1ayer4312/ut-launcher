import { useState, createContext } from "react";
import "./CreateServerWrapper.scss";
import DropdownMenu from "./dropdown-menu/DropdownMenu";

/**
 * @typedef {"match"|"rules"|"settings"|"bots"|"server"} SelectTabType
 * @typedef {ReturnType<typeof useState<SelectTabType>>} SelectTabUseState
 *
 * @typedef {object} SelectTabs
 * @prop {SelectTabType} type
 * @prop {string} title
 *
 * @typedef {SelectTabs[]} Tabs
 *
 * @typedef {object} ServerData
 * @prop {string} serverName
 * @prop {number} numBots
 *
 * @typedef {ReturnType<typeof useState<ServerData>>} ServerDataState
 */

/** @type {Tabs} */
const tabs = [
	{ type: "match", title: "Match" },
	{ type: "rules", title: "Rules" },
	{ type: "settings", title: "Settings" },
	{ type: "bots", title: "Bots" },
	{ type: "server", title: "Server" },
];

const CreateServerContext = createContext(null);

export default function CreateServerWrapper() {
	/** @type {SelectTabUseState} */
	const [selectedTab, setSelectedTab] = useState("match");
	/** @type {ServerDataState} */
	const [serverData, setServerData] = useState({
		numBots: 0,
		serverName: "random",
	});

	return (
		<CreateServerContext value={[serverData, setServerData]}>
			<div className="create-server">
				<div className="create-server_title-bar">
					<span>Start network game</span>
				</div>
				<div className="create-server_content">
					<div className="create-server_tabs">
						{tabs.map((item, index) => {
							const selected = item.type == selectedTab ? "create-server_single-tab_selected" : "";
							return (
								<div
									key={index}
									onClick={() => setSelectedTab(item.type)}
									className={`create-server_single-tab ${selected}`}
								>
									{item.title}
								</div>
							);
						})}
					</div>
					<div className="create-server_tab-options">
						{selectedTab === "match" && <Match />}
						{selectedTab === "rules" && <div>Rules</div>}
						{selectedTab === "settings" && <div>Settings</div>}
						{selectedTab === "bots" && <div>Bots</div>}
						{selectedTab === "server" && <div>Server</div>}
					</div>
					<div className="create-server_footer">
						<div
							className="create-server_start-server"
							// onClick={() => alert("TODO: Server start")}
						>
							Start server
						</div>
					</div>
				</div>
			</div>
		</CreateServerContext>
	);
}

const items = [
	{ title: "item1", value: 1 },
	{ title: "item2", value: 2 },
	{ title: "item3", value: 3 },
	{ title: "item4", value: 4 },
	{ title: "item5", value: 5 },
];

function Match() {
	// /** @type {ServerDataState} */
	// const [serverData, setServerData] = useContext(CreateServerContext);

	return (
		<div>
			<div style={{ display: "flex", gap: "5px", marginTop: "20px" }}>
				<span>Game Type:</span>
				<DropdownMenu
					multiple={true}
					items={items}
					onChange={(value) => console.log("=== Custom", JSON.stringify(value))}
				/>
			</div>
			<div style={{ display: "flex", gap: "5px", marginTop: "20px" }}>
				<span>Server name:</span>
				<input type="text" className="create-server_input" />
			</div>
		</div>
	);
}
