import DiscordWidget from "@src/frontend/components/discord-widget/DiscordWidget";
import "./Community.scss";

export default function Community() {
  return (
    <div className="discord-widgets-wrapper">
      <DiscordWidget inviteLink="https://discord.gg/thURucxzs6" />
      <DiscordWidget inviteLink="https://discord.gg/unrealtournament" />
      <DiscordWidget inviteLink="https://discord.com/invite/zNfekCV" />
    </div>
  );
}
