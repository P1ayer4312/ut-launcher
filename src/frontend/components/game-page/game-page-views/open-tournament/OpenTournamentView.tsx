import GamePageNavbar from "@src/frontend/components/game-page/game-page-navbar/GamePageNavbar";
import Home from "./tab-views/home/Home";
import { openTournamentSocial } from "@src/frontend/providers/communityLinksProvider";
import { getLink, openLinkInBrowser } from "@src/frontend/utils/linksHandlers";

export default function OpenTournamentView() {
  return (
    <>
      <GamePageNavbar>
        <NavbarLinks title="Website" url={openTournamentSocial.website} />
        <NavbarLinks title="Steam" url={openTournamentSocial.steam} />
        <NavbarLinks title="Github" url={openTournamentSocial.github} />
        <NavbarLinks title="Discord" url={getLink(openTournamentSocial.discord)} />
        <NavbarLinks title="Reddit" url={openTournamentSocial.reddit} />
        <NavbarLinks title="Youtube" url={openTournamentSocial.youtube} />
      </GamePageNavbar>
      <Home />
    </>
  );
}

function NavbarLinks(props: { title: string; url: string }) {
  return (
    <div className="game-page-navbar_button" onClick={() => openLinkInBrowser(props.url)}>
      {props.title}
    </div>
  );
}
