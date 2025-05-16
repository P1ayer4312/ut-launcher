import { useState } from "react";
import "./GamePageNavbar.scss";
import { useGlobalState } from "../../../state/useGlobalState";
import contextBridge from "../../../contextBridge/contextBridge";

/** @param {React.PropsWithChildren} props */
export default function GamePageNavbar(props) {
  const { selectedGame, setDownloadingGame } = useGlobalState();
  const [toggle, setToggle] = useState(true);

  return (
    <div className="game-page-navbar">
      {toggle ? (
        <div
          className="game-page-navbar_play-button"
          onClick={() => {
            contextBridge.gameData.get(selectedGame).then(console.log);
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
