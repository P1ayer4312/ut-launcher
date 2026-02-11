import type { IconType } from "react-icons";
import type { TGameId } from "@src/backend/types/gameConfigData.type";
import "./MenuItemGame.scss";
import { useCallback } from "react";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import SpinnerProgressBar from "@src/frontend/components/spinner-progress-bar/SpinnerProgressBar";
import contextBridge from "@src/frontend/contextBridge/contextBridge";

type Props = {
  title: string;
  imgLocation?: string;
  icon?: IconType;
  gameId?: TGameId;
  onClick?: () => void;
};

/**  Menu item cards for each game */
export default function MenuItemGame(props: Props) {
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
