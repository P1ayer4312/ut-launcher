import "./Community.scss";
import DiscordWidget from "@src/frontend/components/discord-widget/DiscordWidget";
import { communityLinks } from "@src/frontend/providers/communityLinksProvider";
import { useGlobalState } from "@src/frontend/state/useGlobalState";

export default function Community() {
  const selectedGame = useGlobalState((e) => e.selectedGame);
  if (selectedGame === "blank") {
    return null;
  }

  const discordLinks = communityLinks[selectedGame]?.discord;

  return (
    <div className="discord-widgets-wrapper">
      {discordLinks?.map((link, index) => {
        return <DiscordWidget key={index} inviteLink={link} />;
      })}
    </div>
  );
}
