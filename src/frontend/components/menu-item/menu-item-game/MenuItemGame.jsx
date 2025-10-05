/** @import { IconType } from "react-icons" */
/** @import { TGameId } from "../../../../backend/types/gameConfigData.cjs" */
import "./MenuItemGame.scss";
import contextBridge from "../../../contextBridge/contextBridge";
import { useGlobalState } from "../../../state/useGlobalState";
import SpinnerProgressBar from "../../spinner-progress-bar/SpinnerProgressBar";

/**
 * Menu item cards for each game
 *
 * @typedef {object} Props
 * @prop {string} title
 * @prop {string?} imgLocation
 * @prop {IconType?} icon
 * @prop {TGameId?} gameId
 * @prop {() => {}} onClick
 *
 * @param {Props} props
 * @returns
 */
export default function MenuItemGame(props) {
	const { setSelectedGame, downloadingGame } = useGlobalState();

	function changeSelectedGame(value) {
		setSelectedGame(value);
		contextBridge.gameData.setLastSelectedGame(value);
	}

	function handleOnClick() {
		if (props.onClick) {
			props.onClick();
		} else if (props.gameId) {
			changeSelectedGame(props.gameId);
		}
	}

	return (
		<div className="menu-item-game_wrapper" onClick={handleOnClick}>
			<div className="menu-item-game_drag-blocker"></div>
			{props.imgLocation && (
				<div className="menu-item-game_badge-wrapper">
					{downloadingGame === props.gameId && <SpinnerProgressBar />}
					<img className="menu-item-game_badge" src={props.imgLocation} />
				</div>
			)}
			{props.icon && <props.icon className="menu-item-game_icon" />}
			<h1 className="menu-item-game_title">{props.title}</h1>
		</div>
	);
}
