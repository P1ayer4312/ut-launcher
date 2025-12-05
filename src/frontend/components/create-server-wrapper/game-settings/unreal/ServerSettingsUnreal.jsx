/** @import { TCreateServerContext, CreateServerUnreal, Context } from "../../../../../backend/types/createServerComponent.cjs" */
import { useState, useContext, useEffect } from "react";
import DropdownMenu from "../../create-server-components/dropdown-menu/DropdownMenu";
import NumberInput from "../../create-server-components/number-input/NumberInput";
import CheckboxInput from "../../create-server-components/checkbox-input/CheckboxInput";
import TextInput from "../../create-server-components/text-input/TextInput";
import RangeInput from "../../create-server-components/range-input/RangeInput";
import "./ServerSettingsUnreal.scss";

/**
 * @typedef {("Rules"|"Settings"|"Bots"|"Server"|"Match")} SelectTabType
 * @typedef {ReturnType<typeof useState<SelectTabType>>} SelectTabUseState
 *
 * @typedef {object} SelectTabs
 * @prop {SelectTabType} type
 * @prop {string} title
 *
 * @typedef {object} Props
 * @prop {Context} context
 */

/** @type {SelectTabs[]} */
const tabs = [
	{ type: "Match", title: "Match" },
	{ type: "Rules", title: "Rules" },
	{ type: "Settings", title: "Settings" },
	{ type: "Bots", title: "Bots" },
	{ type: "Server", title: "Server" },
];

/** @param {Props} props */
export default function ServerSettingsUnreal(props) {
	/** @type {SelectTabUseState} */
	const [selectedTab, setSelectedTab] = useState("Match");
	// /** @type {TCreateServerContext<CreateServerUnreal>} */
	// const [serverData, setServerData] = useContext(props.context);

	// useEffect(() => {
	// 	setServerData({
	// 		bEnableBots: false,
	// 		motd1: "burek",
	// 	});
	// }, [setServerData]);

	return (
		<>
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
				{selectedTab === "Match" && <Match />}
				{selectedTab === "Rules" && <Rules />}
				{selectedTab === "Settings" && <Settings />}
				{selectedTab === "Bots" && <Bots />}
				{selectedTab === "Server" && <Server context={props.context} />}
			</div>
		</>
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
			<table>
				<tbody>
					<tr>
						<td>
							<span>Game Type:</span>
						</td>
						<td>
							<DropdownMenu
								multiple={false}
								items={items}
								onChange={(value) => console.log("=== Custom", JSON.stringify(value))}
							/>
						</td>
					</tr>
					<tr>
						<td>
							<span>Map Name:</span>
						</td>
						<td>
							<DropdownMenu
								multiple={false}
								items={items}
								onChange={(value) => console.log("=== Custom", JSON.stringify(value))}
							/>
						</td>
					</tr>
					<tr>
						<td>
							<span>Mutators:</span>
						</td>
						<td>
							<DropdownMenu
								multiple={true}
								items={items}
								onChange={(value) => console.log("=== Custom", JSON.stringify(value))}
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

function Rules() {
	return (
		<table style={{ borderSpacing: "10px" }}>
			<tbody>
				<tr>
					<td style={{ paddingRight: "20px" }}>
						<NumberInput text={"Max Connections"} onBlur={console.log} />
					</td>
					<td>
						<NumberInput text={"Max Spectators"} onBlur={console.log} />
					</td>
				</tr>
				<tr>
					<td>
						<NumberInput text={"Frag Limit"} onBlur={console.log} />
					</td>
					<td>
						<NumberInput text={"Time Limit"} onBlur={console.log} />
					</td>
				</tr>
				<tr>
					<td>
						<CheckboxInput text="Weapons Stay" onChange={console.log} />
					</td>
				</tr>
				<tr>
					<td>
						<CheckboxInput text="Humans Only" onChange={console.log} />
					</td>
				</tr>
			</tbody>
		</table>
	);
}

function Settings() {
	return (
		<table>
			<tbody>
				<tr>
					<td>Game Style:</td>
					<td>
						<DropdownMenu
							className="server-settings_unreal_settings-tab_style"
							multiple={false}
							items={items}
							onChange={(value) => console.log("=== Custom", JSON.stringify(value))}
						/>
					</td>
				</tr>
				<tr>
					<td>
						Game Speed
						<span>{` [${100}%]:`}</span>
					</td>
					<td>
						<RangeInput />
					</td>
				</tr>
			</tbody>
		</table>
	);
}

function Bots() {
	return (
		<div>
			<table>
				<tbody>
					<tr>
						<td></td>
						<td>
							<CheckboxInput text="Enable Bots" textPosition="left" />
						</td>
					</tr>
					<tr>
						<td>Base Skill:</td>
						<td>
							<DropdownMenu
								className="server-settings_unreal_bots-tab_skill-dropdown"
								items={[{ title: "Average", value: "1" }]}
							/>
						</td>
					</tr>
					<tr>
						<td></td>
						<td>Don't get cocky</td>
					</tr>
				</tbody>
			</table>
			<div>
				<div style={{ margin: "15px 0" }}>
					<NumberInput text="Number of Bots" />
				</div>
				<CheckboxInput text="Auto Adjust Skill" />
			</div>
		</div>
	);
}

/** @param {Props} props */
function Server(props) {
	/** @type {TCreateServerContext<CreateServerUnreal>} */
	const [serverData, setServerData] = useContext(props.context);

	return (
		<table>
			<tbody>
				<tr>
					<td>
						<span>Server Name</span>
					</td>
					<td>
						<TextInput
							className="server-settings_unreal_server-tab"
							onChange={(val) => setServerData((current) => ({ ...current, ServerName: val }))}
							value={serverData.ServerName}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<span>Admin Name</span>
					</td>
					<td>
						<TextInput
							className="server-settings_unreal_server-tab"
							onChange={(val) => setServerData((current) => ({ ...current, AdminName: val }))}
							value={serverData.AdminName}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<span>Admin Email</span>
					</td>
					<td>
						<TextInput
							className="server-settings_unreal_server-tab"
							onChange={(val) => setServerData((current) => ({ ...current, AdminEmail: val }))}
							value={serverData.AdminEmail}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<span>MOTD Line 1</span>
					</td>
					<td>
						<TextInput
							className="server-settings_unreal_server-tab"
							onChange={(val) => setServerData((current) => ({ ...current, MOTDLine1: val }))}
							value={serverData.MOTDLine1}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<span>MOTD Line 2</span>
					</td>
					<td>
						<TextInput
							className="server-settings_unreal_server-tab"
							onChange={(val) => setServerData((current) => ({ ...current, MOTDLine2: val }))}
							value={serverData.MOTDLine2}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<span>MOTD Line 3</span>
					</td>
					<td>
						<TextInput
							className="server-settings_unreal_server-tab"
							onChange={(val) => setServerData((current) => ({ ...current, MOTDLine3: val }))}
							value={serverData.MOTDLine3}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<span>MOTD Line 4</span>
					</td>
					<td>
						<TextInput
							className="server-settings_unreal_server-tab"
							onChange={(val) => setServerData((current) => ({ ...current, MOTDLine4: val }))}
							value={serverData.MOTDLine4}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<span>Advertise Server</span>
					</td>
					<td>
						<CheckboxInput />
					</td>
				</tr>
				<tr>
					<td>
						<span>ngWorldStats Logging</span>
					</td>
					<td>
						<CheckboxInput />
					</td>
				</tr>
				<tr>
					<td>
						<span>Optimize for Lan</span>
					</td>
					<td>
						<CheckboxInput />
					</td>
				</tr>
			</tbody>
		</table>
	);
}
