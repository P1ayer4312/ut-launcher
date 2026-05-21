import "./ProjectLinks.scss";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import MenuItemGame from "@src/frontend/components/menu-item/menu-item-game/MenuItemGame";
import { useGlobalState } from "@src/frontend/state/useGlobalState";

export default function ProjectLinks() {
  const setModalData = useGlobalState((e) => e.setModalData);

  return (
    <div className="project-links_wrapper">
      <MenuItemGame
        icon={FaDiscord}
        title="DISCORD"
        onClick={() => {
          alert("Maybe, if there's interest");
        }}
      />
      <MenuItemGame
        icon={FaGithub}
        title="GITHUB"
        onClick={() => window.open("https://github.com/P1ayer4312/ut-launcher", "_blank")}
      />
      <MenuItemGame
        icon={IoIosSettings}
        title="SETTINGS"
        onClick={() => {
          setModalData({
            isOpened: true,
            modalType: "launcher-settings",
          });
        }}
      />
    </div>
  );
}
