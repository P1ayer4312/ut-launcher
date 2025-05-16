import "./MenuItemGameList.scss";
import MenuItemGame from "../menu-item-game/MenuItemGame";
import { useGlobalState } from "../../../state/useGlobalState";
import contextBridge from "../../../contextBridge/contextBridge";

export default function MenuItemGameList() {
  const { setSelectedGame } = useGlobalState();

  /** @param {TGameId} */
  function changeSelectedGame(value) {
    setSelectedGame(value);
    contextBridge.gameData.setLastSelectedGame(value);
  }

  return (
    <div className="menu-item-game-list">
      <MenuItemGame
        title="UNREAL"
        imgLocation="./imgs/badges/unreal.png"
        onClick={() => changeSelectedGame("unreal")}
      />
      <MenuItemGame
        title="UNREAL II: THE AWAKENING"
        imgLocation="./imgs/badges/unreal-2.png"
        onClick={() => changeSelectedGame("unreal-2")}
      />
      <MenuItemGame
        title="UNREAL TOURNAMENT"
        imgLocation="./imgs/badges/ut-1999.png"
        onClick={() => changeSelectedGame("ut-1999")}
      />
      <MenuItemGame
        title="UNREAL TOURNAMENT 2003"
        imgLocation="./imgs/badges/ut-2003.png"
        onClick={() => changeSelectedGame("ut-2003")}
      />
      <MenuItemGame
        title="UNREAL TOURNAMENT 2004"
        imgLocation="./imgs/badges/ut-2004.png"
        onClick={() => changeSelectedGame("ut-2004")}
      />
      <MenuItemGame
        title="UNREAL TOURNAMENT 3"
        imgLocation="./imgs/badges/ut-3.png"
        onClick={() => changeSelectedGame("ut-3")}
      />
      <MenuItemGame
        title="UNREAL TOURNAMENT 4: ALPHA"
        imgLocation="./imgs/badges/ut-alpha.png"
        onClick={() => changeSelectedGame("ut-alpha")}
      />
      <MenuItemGame
        title="UNREAL CHAMPIONSHIP"
        imgLocation="./imgs/badges/ut-champs.png"
        onClick={() => changeSelectedGame("ut-champs")}
      />
      <MenuItemGame
        title="UNREAL CHAMPIONSHIP 2: THE LIANDRI CONFLICT"
        imgLocation="./imgs/badges/ut-champs-2.png"
        onClick={() => changeSelectedGame("ut-champs-2")}
      />
    </div>
  );
}
