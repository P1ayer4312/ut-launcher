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
const TABS = [
	{ type: "Match", title: "Match" },
	{ type: "Rules", title: "Rules" },
	{ type: "Settings", title: "Settings" },
	{ type: "Bots", title: "Bots" },
	{ type: "Server", title: "Server" },
];

// prettier-ignore
const BOTS_BASE_SKILL = {
	"0": "They won't hurt you...much.",
	"1": "Don't get cocky.",
	"2": "You think you're tough?",
	"3": "You're already dead.",
};

const items = [
	{ title: "item1", value: 1 },
	{ title: "item2", value: 2 },
	{ title: "item3", value: 3 },
	{ title: "item4", value: 4 },
	{ title: "item5", value: 5 },
];

/** @param {CreateServerUnreal} serverData */
function handleGameTypeMaps(serverData) {
	const selectedGameType = serverData.UMenu_UMenuStartGameClientWindow.GameType[0];
	const mapPrefix = serverData.AllGameTypes.find((item) => item.value === selectedGameType)?.mapPrefix;

	if (!mapPrefix) {
		return serverData.AllMaps;
	}

	return serverData.AllMaps.filter((item) => item.toLowerCase().startsWith(mapPrefix));
}

/** @param {Props} props */
export default function ServerSettingsUnreal(props) {
	/** @type {SelectTabUseState} */
	const [selectedTab, setSelectedTab] = useState("Match");

	return (
		<>
			<div className="create-server_tabs">
				{TABS.map((item, index) => {
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
				{selectedTab === "Match" && <Match context={props.context} />}
				{selectedTab === "Rules" && <Rules context={props.context} />}
				{selectedTab === "Settings" && <Settings context={props.context} />}
				{selectedTab === "Bots" && <Bots context={props.context} />}
				{selectedTab === "Server" && <Server context={props.context} />}
			</div>
		</>
	);
}

/** @param {Props} props */
function Match(props) {
	/** @type {TCreateServerContext<CreateServerUnreal>} */
	const [serverData, setServerData] = useContext(props.context);
	const [mapList, setMapList] = useState(handleGameTypeMaps(serverData));

	useEffect(() => {
		setMapList(handleGameTypeMaps(serverData));
	}, [serverData]);

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
								items={serverData.AllGameTypes.map((item) => {
									return { title: item.title, value: item.value };
								})}
								onChange={(val) => {
									const filteredMaps = handleGameTypeMaps(serverData);

									setServerData((current) => {
										const clone = structuredClone(current);

										// This has to be here because between rerenders of the maps dropdown
										// component, the state is not being updated automatically
										clone.UMenu_UMenuStartGameClientWindow.Map = [filteredMaps[0]];

										clone.UMenu_UMenuStartGameClientWindow.GameType = [val[0].value];
										return clone;
									});

									setMapList(filteredMaps);
								}}
								initialValue={serverData.UMenu_UMenuStartGameClientWindow.GameType[0]}
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
								items={mapList.map((item) => ({ title: item, value: item }))}
								initialValue={
									mapList.includes(serverData.UMenu_UMenuStartGameClientWindow.Map[0])
										? serverData.UMenu_UMenuStartGameClientWindow.Map[0]
										: mapList[0]
								}
								onChange={(val) => {
									setServerData((current) => {
										const clone = structuredClone(current);
										clone.UMenu_UMenuStartGameClientWindow.Map = [val[0].value];
										return clone;
									});
								}}
								onInit={() => {
									if (!mapList.includes(serverData.UMenu_UMenuStartGameClientWindow.Map[0])) {
										// This updates the state when the map list changes and sets the state to
										// have a map from the new list (it ain't pretty but it works i guess)
										setServerData((current) => {
											const clone = structuredClone(current);
											clone.UMenu_UMenuStartGameClientWindow.Map = [mapList[0]];
											return clone;
										});
									}
								}}
							/>
						</td>
					</tr>
					<tr>
						<td>
							<span>Mutators:</span>
						</td>
						<td>
							//TODO: Connect state
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

/** @param {Props} props */
function Rules(props) {
	/** @type {TCreateServerContext<CreateServerUnreal>} */
	const [serverData, setServerData] = useContext(props.context);

	return (
		<table style={{ borderSpacing: "10px" }}>
			<tbody>
				<tr>
					<td style={{ paddingRight: "20px" }}>
						<NumberInput
							text={"Max Connections"}
							minValue={1}
							maxValue={64}
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.Engine_GameInfo.MaxPlayers = [val];
									return clone;
								});
							}}
							value={serverData.Engine_GameInfo.MaxPlayers[0]}
						/>
					</td>
					<td>
						<NumberInput
							text={"Max Spectators"}
							minValue={1}
							maxValue={64}
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.Engine_GameInfo.MaxSpectators = [val];
									return clone;
								});
							}}
							value={serverData.Engine_GameInfo.MaxSpectators[0]}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<NumberInput
							text={"Frag Limit"}
							minValue={0}
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.UnrealShare_DeathMatchGame.FragLimit = [val];
									return clone;
								});
							}}
							value={serverData.UnrealShare_DeathMatchGame.FragLimit[0]}
						/>
					</td>
					<td>
						<NumberInput
							text={"Time Limit"}
							minValue={0}
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.UnrealShare_DeathMatchGame.TimeLimit = [val];
									return clone;
								});
							}}
							value={serverData.UnrealShare_DeathMatchGame.TimeLimit[0]}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<CheckboxInput
							text="Weapons Stay"
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.UnrealShare_DeathMatchGame.bCoopWeaponMode = [val === "True" ? "False" : "True"];
									return clone;
								});
							}}
							checked={serverData.UnrealShare_DeathMatchGame.bCoopWeaponMode[0] !== "True"}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<CheckboxInput
							text="Humans Only"
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.UnrealShare_DeathMatchGame.bHumansOnly = [val];
									return clone;
								});
							}}
							checked={serverData.UnrealShare_DeathMatchGame.bHumansOnly[0]}
						/>
					</td>
				</tr>
			</tbody>
		</table>
	);
}

/** @param {Props} props */
function Settings(props) {
	const [temp, setTemp] = useState(50);
	return (
		<table>
			<tbody>
				<tr>
					<td style={{ width: "180px" }}>Game Style:</td>
					<td>
						//TODO: Connect state
						<DropdownMenu
							className="server-settings_unreal_settings-tab_style"
							multiple={false}
							items={[
								{ title: "Classic", value: 0 },
								{ title: "Hardcore", value: 1 },
								{ title: "Turbo", value: 2 },
							]}
							onChange={(value) => console.log("=== Custom", JSON.stringify(value))}
						/>
					</td>
				</tr>
				<tr>
					<td>
						Game Speed
						<span>{` [${temp}%]:`}</span>
					</td>
					<td>
						//TODO: Connect state
						<RangeInput onChange={setTemp} min={50} max={200} step={5} value={temp} />
					</td>
				</tr>
			</tbody>
		</table>
	);
}

/** @param {Props} props */
function Bots(props) {
	/** @type {TCreateServerContext<CreateServerUnreal>} */
	const [serverData, setServerData] = useContext(props.context);

	return (
		<div>
			<table>
				<tbody>
					<tr>
						<td></td>
						<td>
							<CheckboxInput
								text="Enable Bots"
								textPosition="left"
								onChange={(val) => {
									setServerData((current) => {
										const clone = structuredClone(current);
										clone.UnrealShare_DeathMatchGame.bMultiPlayerBots = [val];
										return clone;
									});
								}}
								checked={serverData.UnrealShare_DeathMatchGame.bMultiPlayerBots[0]}
							/>
						</td>
					</tr>
					<tr>
						<td>Base Skill:</td>
						<td>
							<DropdownMenu
								className="server-settings_unreal_bots-tab_skill-dropdown"
								items={[
									{ title: "Novice", value: "0" },
									{ title: "Average", value: "1" },
									{ title: "Skilled", value: "2" },
									{ title: "Masterful", value: "3" },
								]}
								onChange={(val) => {
									setServerData((current) => {
										const clone = structuredClone(current);
										clone.UnrealShare_BotInfo.Difficulty = [val[0].value];
										return clone;
									});
								}}
								initialValue={serverData.UnrealShare_BotInfo.Difficulty[0]}
							/>
						</td>
					</tr>
					<tr>
						<td></td>
						<td>{BOTS_BASE_SKILL[serverData.UnrealShare_BotInfo.Difficulty[0]]}</td>
					</tr>
				</tbody>
			</table>
			<div>
				<div style={{ margin: "15px 0" }}>
					<NumberInput
						text="Number of Bots"
						minValue={1}
						maxValue={22}
						onChange={(val) => {
							setServerData((current) => {
								const clone = structuredClone(current);
								clone.UnrealShare_DeathMatchGame.InitialBots = [val];
								return clone;
							});
						}}
						value={serverData.UnrealShare_DeathMatchGame.InitialBots[0]}
					/>
				</div>
				<CheckboxInput
					text="Auto Adjust Skill"
					onChange={(val) => {
						setServerData((current) => {
							const clone = structuredClone(current);
							clone.UnrealShare_BotInfo.bAdjustSkill = [val];
							return clone;
						});
					}}
					checked={serverData.UnrealShare_BotInfo.bAdjustSkill[0]}
				/>
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
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.Engine_GameReplicationInfo.ServerName = [val];
									return clone;
								});
							}}
							value={serverData.Engine_GameReplicationInfo.ServerName[0]}
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
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.Engine_GameReplicationInfo.AdminName = [val];
									return clone;
								});
							}}
							value={serverData.Engine_GameReplicationInfo.AdminName[0]}
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
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.Engine_GameReplicationInfo.AdminEmail = [val];
									return clone;
								});
							}}
							value={serverData.Engine_GameReplicationInfo.AdminEmail[0]}
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
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.Engine_GameReplicationInfo.MOTDLine1 = [val];
									return clone;
								});
							}}
							value={serverData.Engine_GameReplicationInfo.MOTDLine1[0]}
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
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.Engine_GameReplicationInfo.MOTDLine2 = [val];
									return clone;
								});
							}}
							value={serverData.Engine_GameReplicationInfo.MOTDLine2[0]}
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
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.Engine_GameReplicationInfo.MOTDLine3 = [val];
									return clone;
								});
							}}
							value={serverData.Engine_GameReplicationInfo.MOTDLine3[0]}
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
							onChange={(val) => {
								setServerData((current) => {
									const clone = structuredClone(current);
									clone.Engine_GameReplicationInfo.MOTDLine4 = [val];
									return clone;
								});
							}}
							value={serverData.Engine_GameReplicationInfo.MOTDLine4[0]}
						/>
					</td>
				</tr>
				<tr>
					<td>
						<span>Advertise Server</span>
					</td>
					<td>
						//TODO: Connect state
						<CheckboxInput />
					</td>
				</tr>
				<tr>
					<td>
						<span>ngWorldStats Logging</span>
					</td>
					<td>
						//TODO: Connect state
						<CheckboxInput />
					</td>
				</tr>
				<tr>
					<td>
						<span>Optimize for Lan</span>
					</td>
					<td>
						//TODO: Connect state
						<CheckboxInput />
					</td>
				</tr>
			</tbody>
		</table>
	);
}
