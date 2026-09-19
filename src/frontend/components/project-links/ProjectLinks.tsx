import "./ProjectLinks.scss";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import MenuItemGame from "@src/frontend/components/menu-item/menu-item-game/MenuItemGame";
import { useGlobalState } from "@src/frontend/state/useGlobalState";
import { openLinkInBrowser } from "@src/frontend/utils/linksHandlers";

export default function ProjectLinks() {
  const setModalData = useGlobalState((e) => e.setModalData);

  return (
    <div className="project-links_wrapper">
      {/* <MenuItemGame
        icon={FaDiscord}
        title="DISCORD"
        tooltipId="discord"
        onClick={() => {
          alert("Maybe, if there's interest");
        }}
      /> */}
      <MenuItemGame
        icon={FaGithub}
        title="GITHUB"
        tooltipId="github"
        onClick={() => openLinkInBrowser("https://github.com/P1ayer4312/ut-launcher")}
      />
      <MenuItemGame
        icon={IoIosSettings}
        title="SETTINGS"
        tooltipId="settings"
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
