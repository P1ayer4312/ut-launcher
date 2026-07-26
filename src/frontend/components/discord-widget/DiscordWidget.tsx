import "./DiscordWidget.scss";
import { useQuery } from "@tanstack/react-query";
import { getLink } from "@src/frontend/utils/linksHandlers";

type Props = {
  inviteLink: string;
};

const numFormat = Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function DiscordWidget({ inviteLink }: Props) {
  const inviteCode = inviteLink?.replaceAll(atob("QF9fX18j"), "");
  // Prevent api spam on view change
  const query = useQuery({
    queryKey: ["discordData", inviteCode],
    queryFn: () => fetch(`https://discord.com/api/v9/invites/${inviteCode}`).then((res) => res.json()),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 600000,
    gcTime: 600000,
    retry: 1,
  });

  const guild = query.data?.guild;

  return (
    <a
      title={query.isSuccess ? guild.description : undefined}
      href={getLink(inviteLink)}
      target="_blank"
      style={
        guild?.banner
          ? {
              backgroundImage:
                `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), ` +
                `url("https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png?size=256")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "100%",
              backgroundPositionY: "center",
              backgroundSize: "unset",
            }
          : undefined
      }
      className="discord-widget_wrapper"
      rel="noreferrer"
    >
      <div className="discord-widget_left-side">
        <div className="discord-widget_left-side_wrapper">
          {query.isSuccess && !query.data?.message ? (
            <>
              <img
                className="discord-widget_left-side_img"
                alt=""
                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`}
              />
              <span className="discord-widget_left-side_members-count">
                <span style={{ color: "#43A25A" }}>{numFormat.format(query.data.profile.online_count)}</span>
                <span style={{ color: "white" }}> / </span>
                <span style={{ color: "#74757C" }}>{numFormat.format(query.data.profile.member_count)}</span>
              </span>
            </>
          ) : null}
        </div>
      </div>

      <div className="discord-widget_right-side">
        {query.isError || query.data?.message ? (
          <>
            <div className="discord-widget_right-side_name" style={{ color: "red" }}>
              Invalid Link
            </div>
            <div className="discord-widget_right-side_desc" style={{ color: "red" }}>
              {inviteLink}
            </div>
          </>
        ) : query.isLoading ? (
          <>
            <div className="discord-widget_right-side_name">Loading...</div>
          </>
        ) : query.isSuccess ? (
          <>
            <div className="discord-widget_right-side_name">{guild.name}</div>
            {guild.description && (
              <div className="discord-widget_right-side_desc">
                {guild.description?.length > 123
                  ? `${guild.description?.substring(0, 123)}...`
                  : guild.description}
              </div>
            )}
          </>
        ) : null}
      </div>
    </a>
  );
}
