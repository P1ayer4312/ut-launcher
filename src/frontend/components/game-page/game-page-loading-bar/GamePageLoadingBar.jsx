import { useState } from "react";
import "./GamePageLoadingBar.scss";

export default function GamePageLoadingBar({ valuePercent = 0 }) {
  return (
    <div className="game-page_loading-bar">
      <span>Downloading: 751.4MB/1.7GB 419.6MB/s estimate: 2 sec</span>
      <div style={{ width: `${valuePercent}%` }} className="game-page_loading-bar-progress"></div>
    </div>
  );
}
