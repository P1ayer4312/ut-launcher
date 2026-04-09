import UnrealView from "@src/frontend/components/game-page/game-page-views/unreal/UnrealView";
import Unreal2View from "@src/frontend/components/game-page/game-page-views/unreal-2/Unreal2View";
import UT1999View from "@src/frontend/components/game-page/game-page-views/ut-1999/UT1999View";
import UT2003View from "@src/frontend/components/game-page/game-page-views/ut-2003/UT2003View";
import UT2004View from "@src/frontend/components/game-page/game-page-views/ut-2004/UT2004View";
import UT3View from "@src/frontend/components/game-page/game-page-views/ut-3/UT3View";
import UT4AlphaView from "@src/frontend/components/game-page/game-page-views/ut-alpha/UT4AlphaView";
import UTChampsView from "@src/frontend/components/game-page/game-page-views/ut-champs/UTChampsView";
import UTChamps2View from "@src/frontend/components/game-page/game-page-views/ut-champs-2/UTChamps2View";
import { useGlobalState } from "@src/frontend/state/useGlobalState";

export default function GamePageHandler() {
  const { selectedGame } = useGlobalState();

  switch (selectedGame) {
    case "unreal":
      return <UnrealView />;
    case "unreal-2":
      return <Unreal2View />;
    case "ut-1999":
      return <UT1999View />;
    case "ut-2003":
      return <UT2003View />;
    case "ut-2004":
      return <UT2004View />;
    case "ut-3":
      return <UT3View />;
    case "ut-alpha":
      return <UT4AlphaView />;
    case "ut-champs":
      return <UTChampsView />;
    case "ut-champs-2":
      return <UTChamps2View />;
    default:
      return null;
  }
}
