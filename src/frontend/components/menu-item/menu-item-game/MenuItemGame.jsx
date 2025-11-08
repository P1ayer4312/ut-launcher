/** @import { IconType } from "react-icons" */
/** @import { TGameId } from "../../../../backend/types/gameConfigData.cjs" */
import "./MenuItemGame.scss";
import contextBridge from "../../../contextBridge/contextBridge";
import { useGlobalState } from "../../../state/useGlobalState";
import SpinnerProgressBar from "../../spinner-progress-bar/SpinnerProgressBar";
import { useCallback } from "react";

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

	const handleOnClick = useCallback(() => {
		if (props.onClick) {
			props.onClick();
		} else if (props.gameId) {
			setSelectedGame(props.gameId);
			contextBridge.gameData.setLastSelectedGame(props.gameId);
		}
	}, [props, setSelectedGame]);

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
