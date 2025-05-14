import { useGlobalState } from "../../../state/useGlobalState";
import UT4AlphaView from "../game-page-views/ut-alpha/UT4AlphaView";

export default function GamePageHandler() {
  const { selectedGame } = useGlobalState();

  switch (selectedGame) {
    case "ut-alpha":
      return <UT4AlphaView />;
    default:
      return null;
  }
}
