import { useState } from "react";
import "./GamePageNavbar.scss";

export default function GamePageNavbar() {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="game-page-navbar">
      {toggle ? (
        <div className="game-page-navbar_play-button" onClick={() => setToggle((value) => !value)}>
          PLAY
        </div>
      ) : (
        <div className="game-page-navbar_install-button" onClick={() => setToggle((value) => !value)}>
          INSTALL
        </div>
      )}
      <div className="game-page-navbar_button">Community</div>
      <div className="game-page-navbar_button">Guides</div>
      <div className="game-page-navbar_button">Servers</div>
    </div>
  );
}
