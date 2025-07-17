import { useState } from "react";
import { useGlobalState } from "../../../../state/useGlobalState";
import GamePageNavbar from "../../game-page-navbar/GamePageNavbar";
import GamePageLoadingBar from "../../game-page-loading-bar/GamePageLoadingBar";
import Home from "./tab-views/home/Home";
import ScreenshotsTab from "../../../navbar-tabs/screenshots-tab/ScreenshotsTab";
import Community from "./tab-views/community/Community";
import SettingsTab from "../../../navbar-tabs/settings-tab/SettingsTab";

export default function UT1999View() {
	const { downloadingGame, selectedGame } = useGlobalState();
	const [activeTab, setActiveTab] = useState("home");

	return (
		<>
			<GamePageNavbar>
				<div className="game-page-navbar_button" onClick={() => setActiveTab("home")}>
					Home
				</div>
				<div className="game-page-navbar_button" onClick={() => setActiveTab("community")}>
					Community
				</div>
				<div className="game-page-navbar_button" onClick={() => setActiveTab("screenshots")}>
					Screenshots
				</div>
				<div className="game-page-navbar_button" onClick={() => setActiveTab("settings")}>
					Settings
				</div>
			</GamePageNavbar>
			{selectedGame == downloadingGame && <GamePageLoadingBar />}
			<GetTabView activeTab={activeTab} />
		</>
	);
}

function GetTabView({ activeTab = "" }) {
	switch (activeTab) {
		case "home":
			return <Home />;
		case "screenshots":
			return <ScreenshotsTab />;
		case "community":
			return <Community />;
		case "settings":
			return <SettingsTab />;
		default:
			return null;
	}
}
