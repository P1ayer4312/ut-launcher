/** @import { TGameId } from "../../../state/useGlobalState" */
import "./MenuItemGame.scss";
import contextBridge from "../../../contextBridge/contextBridge";
import { useGlobalState } from "../../../state/useGlobalState";

/**
 * Menu item cards for each game
 *
 * @typedef {object} Props
 * @prop {string} title
 * @prop {string} imgLocation
 * @prop {TGameId} gameId
 *
 * @param {Props} props
 * @returns
 */
export default function MenuItemGame(props) {
	const { setSelectedGame } = useGlobalState();

	function changeSelectedGame(value) {
		setSelectedGame(value);
		contextBridge.gameData.setLastSelectedGame(value);
	}

	return (
		<div className="menu-item-game_wrapper" onClick={() => changeSelectedGame(props.gameId)}>
			<div className="menu-item-game_drag-blocker"></div>
			<img className="menu-item-game_badge" src={props.imgLocation} />
			<h1 className="menu-item-game_title">{props.title}</h1>
		</div>
	);
}
