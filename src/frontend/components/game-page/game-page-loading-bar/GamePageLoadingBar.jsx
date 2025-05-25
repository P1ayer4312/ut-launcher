import { useGlobalState } from "../../../state/useGlobalState";
import "./GamePageLoadingBar.scss";

export default function GamePageLoadingBar({ valuePercent = 0 }) {
  const { progressBar } = useGlobalState();
  console.log(progressBar);
  return (
    <div className="game-page_loading-bar">
      <span>{progressBar.text}</span>
      <div style={{ width: `${progressBar.percentage}%` }} className="game-page_loading-bar-progress"></div>
    </div>
  );
}
