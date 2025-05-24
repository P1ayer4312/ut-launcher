import { useState } from "react";
import "./GamePageNavbar.scss";
import { useGlobalState } from "../../../state/useGlobalState";
import contextBridge from "../../../contextBridge/contextBridge";

/**
 * @typedef {object} NavbarProps
 * @prop {boolean} unavailable Game is unavailable to download
 * @prop {boolean} stop Stop the current download process
 *
 * @param {NavbarProps & React.PropsWithChildren} props
 */
export default function GamePageNavbar(props) {
  const { selectedGame, setDownloadingGame } = useGlobalState();
  const [toggle, setToggle] = useState(true);

  return (
    <div className="game-page-navbar">
      {props.stop ? (
        <div
          className="game-page-navbar_action-button game-page-navbar_stop"
          onClick={() => {
            contextBridge.gameData.get(selectedGame).then(console.log);
            setToggle((value) => !value);
          }}
        >
          STOP
        </div>
      ) : props.unavailable ? (
        <div
          className="game-page-navbar_action-button game-page-navbar_unavailable"
          onClick={() => {
            contextBridge.gameData.get(selectedGame).then(console.log);
            setToggle((value) => !value);
          }}
        >
          UNAVAILABLE
        </div>
      ) : toggle ? (
        <div
          className="game-page-navbar_action-button game-page-navbar_play"
          onClick={() => {
            contextBridge.gameData.get(selectedGame).then(console.log);
            setToggle((value) => !value);
          }}
        >
          PLAY
        </div>
      ) : (
        <div
          className="game-page-navbar_action-button game-page-navbar_install"
          onClick={() => {
            setDownloadingGame(selectedGame);
            setToggle((value) => !value);
          }}
        >
          INSTALL
        </div>
      )}
      {props.children}
    </div>
  );
}
