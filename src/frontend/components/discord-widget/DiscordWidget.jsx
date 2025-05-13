import { useEffect, useState, use } from "react";
import "./DiscordWidget.scss";

export default function DiscordWidget({ inviteLink }) {
  const [inviteData, setInviteData] = useState(true);

  useEffect(() => {
    console.log(1);
  }, []);

  if (!inviteData) {
    return null;
  }

  return (
    <div className="discord-widget_wrapper">
      <div className="discord-widget_left-side">
        <div className="discord-widget_left-side_wrapper">
          <img className="discord-widget_left-side_img" src="./temp/icon.png" alt="" srcset="" />
          <span className="discord-widget_left-side_members-count">
            <span style={{ color: "#43A25A" }}>3040</span>
            <span style={{ color: "white" }}> / </span>
            <span style={{ color: "#74757C" }}>90901</span>
          </span>
        </div>
      </div>
      <div className="discord-widget_right-side">
        {/* <img src="./temp/banner.png" alt="" /> */}
        <div className="discord-widget_right-side_banner">
          <div className="discord-widget_right-side_banner_name">UnrealTournament</div>
          <div className="discord-widget_right-side_banner_desc">
            Official Unreal Tournament Discord server.
          </div>
        </div>
        {/* <p>UnrealTournament</p>
        <p>Official Unreal Tournament Discord server.</p> */}
      </div>
    </div>
  );
}
