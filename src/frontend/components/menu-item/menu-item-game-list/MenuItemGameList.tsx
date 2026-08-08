import "./MenuItemGameList.scss";
import MenuItemGame from "@src/frontend/components/menu-item/menu-item-game/MenuItemGame";
import ProjectLinks from "@src/frontend/components/project-links/ProjectLinks";
import { TGameId } from "@src/backend/types/gameConfigData.type";

type TitlesData = {
  title: string;
  imgLocation: string;
  gameId: TGameId;
};

const games: TitlesData[] = [
  { title: "UNREAL", imgLocation: "./imgs/badges/unreal.png", gameId: "unreal" },
  { title: "UNREAL II: THE AWAKENING", imgLocation: "./imgs/badges/unreal-2.png", gameId: "unreal-2" },
  { title: "UNREAL TOURNAMENT", imgLocation: "./imgs/badges/ut-1999.png", gameId: "ut-1999" },
  { title: "UNREAL TOURNAMENT 2003", imgLocation: "./imgs/badges/ut-2003.png", gameId: "ut-2003" },
  { title: "UNREAL TOURNAMENT 2004", imgLocation: "./imgs/badges/ut-2004.png", gameId: "ut-2004" },
  { title: "UNREAL TOURNAMENT 3", imgLocation: "./imgs/badges/ut-3.png", gameId: "ut-3" },
  { title: "UNREAL TOURNAMENT 4: ALPHA", imgLocation: "./imgs/badges/ut-alpha.png", gameId: "ut-alpha" },
  { title: "UNREAL CHAMPIONSHIP", imgLocation: "./imgs/badges/ut-champs.png", gameId: "ut-champs" },
  {
    title: "UNREAL CHAMPIONSHIP 2: THE LIANDRI CONFLICT",
    imgLocation: "./imgs/badges/ut-champs-2.png",
    gameId: "ut-champs-2",
  },
  {
    title: "OPEN TOURNAMENT",
    imgLocation: "./imgs/badges/open-tournament.png",
    gameId: "open-tournament",
  },
];

export default function MenuItemGameList() {
  return (
    <div className="menu-item-game-list">
      {games.map((game) => (
        <MenuItemGame
          key={game.gameId}
          title={game.title}
          imgLocation={game.imgLocation}
          gameId={game.gameId}
        />
      ))}

      <ProjectLinks />
    </div>
  );
}
