import "./MenuItemGameList.scss";
import MenuItemGame from "../menu-item-game/MenuItemGame";
import { useGlobalState } from "../../state/useGlobalState";

export default function MenuItemGameList() {
  const { setSelectedGame } = useGlobalState();

  return (
    <div className="menu-item-game-list">
      <MenuItemGame title="UNREAL" imgLocation="./imgs/badges/unreal.png" />
      <MenuItemGame title="UNREAL II: THE AWAKENING" imgLocation="./imgs/badges/unreal-2.png" />
      <MenuItemGame
        title="UNREAL TOURNAMENT"
        imgLocation="./imgs/badges/ut-1999.png"
        onClick={() => setSelectedGame("ut-1999")}
      />
      <MenuItemGame title="UNREAL TOURNAMENT 2003" imgLocation="./imgs/badges/ut-2003.png" />
      <MenuItemGame title="UNREAL TOURNAMENT 2004" imgLocation="./imgs/badges/ut-2004.png" />
      <MenuItemGame
        title="UNREAL TOURNAMENT 3"
        imgLocation="./imgs/badges/ut-3.png"
        onClick={() => setSelectedGame("ut-3")}
      />
      <MenuItemGame
        title="UNREAL TOURNAMENT 4: ALPHA"
        imgLocation="./imgs/badges/ut-alpha.png"
        onClick={() => setSelectedGame("ut-alpha")}
      />
      <MenuItemGame title="UNREAL CHAMPIONSHIP" imgLocation="./imgs/badges/ut-champs.png" />
      <MenuItemGame
        title="UNREAL CHAMPIONSHIP 2: THE LIANDRI CONFLICT"
        imgLocation="./imgs/badges/ut-champs-2.png"
      />
    </div>
  );
}
