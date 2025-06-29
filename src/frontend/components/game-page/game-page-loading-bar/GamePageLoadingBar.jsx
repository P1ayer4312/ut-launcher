import { useGlobalState } from "../../../state/useGlobalState";
import "./GamePageLoadingBar.scss";

export default function GamePageLoadingBar() {
  const { progressBar } = useGlobalState();
  return (
    <div className="game-page_loading-bar">
      <span>{progressBar.text}</span>
      <div style={{ width: `${progressBar.percentage}%` }} className="game-page_loading-bar-progress"></div>
    </div>
  );
}
