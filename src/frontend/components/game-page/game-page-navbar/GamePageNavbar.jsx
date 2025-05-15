import { useState } from "react";
import "./GamePageNavbar.scss";
import { useGlobalState } from "../../../state/useGlobalState";

/** @param {React.PropsWithChildren} props */
export default function GamePageNavbar(props) {
  const { selectedGame, setDownloadingGame } = useGlobalState();
  const [toggle, setToggle] = useState(true);

  /** @type {TContextBridgeGameData} */
  const gameData = window.gameData ?? {};

  return (
    <div className="game-page-navbar">
      {toggle ? (
        <div
          className="game-page-navbar_play-button"
          onClick={() => {
            gameData.get(selectedGame).then(console.log);
            setToggle((value) => !value);
          }}
        >
          PLAY
        </div>
      ) : (
        <div
          className="game-page-navbar_install-button"
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
