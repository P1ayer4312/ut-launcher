import "./MenuItemGame.scss";
import type { IconType } from "react-icons";
import { createPortal } from "react-dom";
import { Tooltip } from "react-tooltip";
import type { TGameId } from "@src/backend/types/gameConfigData.type";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import GameStatusIcon from "@src/frontend/components/game-status-icon/GameStatusIcon";
import contextBridge from "@src/frontend/contextBridge/contextBridge";

type Props = {
  title: string;
  icon?: IconType;
  gameId?: TGameId;
  tooltipId?: string;
  onClick?: () => void;
};

/**  Menu item cards for each game */
export default function MenuItemGame(props: Props) {
  const setSelectedGame = useGlobalState((s) => s.setSelectedGame);
  const downloadingGame = useGlobalState((s) => s.downloadingGame);
  const gameDataPresent = useGlobalState((e) => props.gameId && Boolean(e.localDataStore[props.gameId]));
  const setLocalDataStore = useGlobalState((e) => e.setLocalDataStore);
  const runningGame = useGlobalState((e) => e.runningGame);

  const isGameDownloading = downloadingGame === props.gameId;
  const tooltipId = props.gameId || props.tooltipId;

  function handleOnClick() {
    if (props.onClick) {
      props.onClick();
    } else if (props.gameId) {
      const gameId = props.gameId;
      new Promise<void>((resolve) => {
        // We do the Promise wrapper to preload the game data to avoid
        // the play/install button flashing on page load
        if (gameDataPresent) {
          // Data is already loaded for that game
          resolve();
        } else {
          contextBridge.gameData
            .get(gameId)
            .then((data) => setLocalDataStore({ [gameId]: data }))
            .finally(resolve);
        }
      }).then(() => {
        // Switch the game view once we ensured the data is present
        setSelectedGame(gameId);
        contextBridge.gameData.setLastSelectedGame(gameId);
      });
    }
  }

  return (
    <>
      <div className="menu-item-game_wrapper" onClick={handleOnClick} data-tooltip-id={tooltipId}>
        {props.icon ? (
          <props.icon className="menu-item-game_icon" />
        ) : (
          <div className="menu-item-game_badge-wrapper">
            {isGameDownloading && <GameStatusIcon status="spinner" />}
            {runningGame === props.gameId && <GameStatusIcon status="playing" />}
            <img
              className="menu-item-game_badge"
              src={`./imgs/badges/${props.gameId}.png`}
              draggable={false}
            />
          </div>
        )}
      </div>
      {createPortal(
        <Tooltip
          id={tooltipId}
          content={props.title}
          offset={10}
          place="right"
          delayShow={1000}
          style={{ backgroundColor: "black" }}
        />,
        document.body,
      )}
    </>
  );
}
