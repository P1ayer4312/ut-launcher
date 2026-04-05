import { useGlobalState } from "@src/frontend/state/useGlobalState";
import "./GamePageLoadingBar.scss";

export default function GamePageLoadingBar() {
  const progressBar = useGlobalState((e) => e.progressBar);
  return (
    <div className="game-page_loading-bar">
      <span>{progressBar.text}</span>
      <div style={{ width: `${progressBar.percentage}%` }} className="game-page_loading-bar-progress"></div>
    </div>
  );
}
