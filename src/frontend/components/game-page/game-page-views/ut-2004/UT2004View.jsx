import { useState } from "react";
import GamePageNavbar from "../../game-page-navbar/GamePageNavbar";
import { useGlobalState } from "../../../../state/useGlobalState";
import GamePageLoadingBar from "../../game-page-loading-bar/GamePageLoadingBar";
import Home from "./tab-views/home/Home";
import SettingsTab from "../../../navbar-tabs/settings-tab/SettingsTab";

export default function UT2004View() {
	const { downloadingGame, selectedGame } = useGlobalState();
	const [activeTab, setActiveTab] = useState("home");

	function getTabView(activeTab) {
		switch (activeTab) {
			case "home":
				return <Home />;
			case "settings":
				return <SettingsTab />;
			default:
				return null;
		}
	}

	return (
		<>
			<GamePageNavbar>
				<div className="game-page-navbar_button" onClick={() => setActiveTab("home")}>
					Home
				</div>
				<div className="game-page-navbar_button" onClick={() => setActiveTab("settings")}>
					Settings
				</div>
			</GamePageNavbar>
			{selectedGame == downloadingGame && <GamePageLoadingBar valuePercent={22} />}
			{getTabView(activeTab)}
		</>
	);
}
