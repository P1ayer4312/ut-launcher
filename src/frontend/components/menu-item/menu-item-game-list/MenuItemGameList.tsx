import "./MenuItemGameList.scss";
import MenuItemGame from "@src/frontend/components/menu-item/menu-item-game/MenuItemGame";
import ProjectLinks from "@src/frontend/components/project-links/ProjectLinks";
import { TGameId } from "@src/backend/types/gameConfigData.type";
import { titlesData } from "@src/frontend/providers/titlesDataProvider";

export default function MenuItemGameList() {
  return (
    <div className="menu-item-game-list">
      {(Object.keys(titlesData) as TGameId[]).map((gameId, index) => {
        const game = titlesData[gameId];
        if (!game) {
          throw new Error(`Undefined title data: ${game}`);
        }

        return <MenuItemGame key={index} title={game.title} gameId={gameId} />;
      })}

      <ProjectLinks />
    </div>
  );
}
