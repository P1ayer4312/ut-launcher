import "./MenuItemGame.scss";
import type { IconType } from "react-icons";
import type { TGameId } from "@src/backend/types/gameConfigData.type";
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
  const setSelectedGame = useGlobalState((s) => s.setSelectedGame);
  const runningGame = useGlobalState((s) => s.runningGame);
  const downloadingGame = useGlobalState((s) => s.downloadingGame);
  const gameDataPresent = useGlobalState((e) => props.gameId && Boolean(e.localDataStore[props.gameId]));
  const setLocalDataStore = useGlobalState((e) => e.setLocalDataStore);

  const isGameRunning = runningGame === props.gameId;
  const isGameDownloading = downloadingGame === props.gameId;

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
    <div className="menu-item-game_wrapper" onClick={handleOnClick}>
      <div className="menu-item-game_drag-blocker"></div>
      {props.imgLocation && (
        <div className="menu-item-game_badge-wrapper">
          {isGameDownloading && <SpinnerProgressBar />}
          <img className="menu-item-game_badge" src={props.imgLocation} />
        </div>
      )}
      {props.icon && <props.icon className="menu-item-game_icon" />}
      <h1
        className="menu-item-game_title"
        style={{ color: isGameRunning ? "lightgreen" : isGameDownloading ? "#71ddf5" : undefined }}
      >
        {props.title}
      </h1>
    </div>
  );
}
