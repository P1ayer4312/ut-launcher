import "./ProjectLinks.scss";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import MenuItemGame from "@src/frontend/components/menu-item/menu-item-game/MenuItemGame";

export default function ProjectLinks() {
  return (
    <div className="project-links_wrapper">
      <MenuItemGame
        icon={FaDiscord}
        title="DISCORD"
        onClick={() => {
          throw new Error("TODO: ADD LINK");
        }}
      />
      <MenuItemGame
        icon={FaGithub}
        title="GITHUB"
        onClick={() => window.open("https://github.com/P1ayer4312/ut-launcher", "_blank")}
      />
      <MenuItemGame icon={IoIosSettings} title="SETTINGS" onClick={() => alert("clicked")} />
    </div>
  );
}
