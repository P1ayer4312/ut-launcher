import { useGlobalState } from "../../../state/useGlobalState";
import UnrealView from "../game-page-views/unreal/UnrealView";
import Unreal2View from "../game-page-views/unreal-2/Unreal2View";
import UT1999View from "../game-page-views/ut-1999/UT1999View";
import UT2003View from "../game-page-views/ut-2003/UT2003View";
import UT2004View from "../game-page-views/ut-2004/UT2004View";
import Unreal3View from "../game-page-views/ut-3/Unreal3View";
import UT4AlphaView from "../game-page-views/ut-alpha/UT4AlphaView";
import UTChampsView from "../game-page-views/ut-champs/UTChampsView";
import UTChamps2View from "../game-page-views/ut-champs-2/UTChamps2View";

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
      return <Unreal3View />;
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
