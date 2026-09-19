import { TGameId } from "@src/frontend/state/useGlobalState.type";

type TitleDataBody = {
  title: string;
  releaseDate: string;
  description: string;
};

type TitlesData = Partial<Record<TGameId, TitleDataBody>>;

export const titlesData: TitlesData = {
  unreal: {
    title: "UNREAL",
    description: `Your prison ship has crash-landed on the fastest, sleekest, most dangerous
      3D world ever created. Look around: crystal-clear water shimmers, shadows dance and shift,
      alien architecture fades into the horizon. Discover the secret of this mysterious planet
      and find out what caused a peaceful race to be enslaved by vicious merciless aggressors.`,
    releaseDate: "May 22, 1998",
  },
  "ut-1999": {
    title: "UNREAL TOURNAMENT",
    description: `Step into the arena, face off with skilled opponents (bot and human alike),
      and put yourself to the test in the tournament that defined a genre. Featuring both single
      and multiplayer, Unreal Tournament featured a variety of iconic modes, like Capture the
      Flag, Deathmatch, Assault, Domination, and over 50 unique levels of battle—including a
      galleon ship, Egyptian tombs, submarines, speeding trains, space castles, and more—brought
      to life as works of art using the early Unreal Engine.`,
    releaseDate: "November 30, 1999",
  },
  "unreal-2": {
    title: "UNREAL II: THE AWAKENING",
    description: `You are John Dalton, an ex-Marine assigned to patrol the edge of human space
      as a Marshal for the Terran Colonial Authority. Unexpectedly, your monotonous life is
      shattered by a chilling distress signal, plunging you into an adventure beyond belief.
      Violent turmoil among the races has erupted on your watch. Thrust into a conflict that
      will determine the fate of the galaxy, you are humanity's only hope for salvation.
      Only you can prevent the Awakening.`,
    releaseDate: "February 4, 2003",
  },
  "ut-2003": {
    title: "UNREAL TOURNAMENT 2003",
    description: `Mining companies have been running smaller matches to channel aggression,
      but now the Liandri Mining Corporation established a professional league, which quickly
      proves to be an extremely lucrative way of public entertainment. Liandri entered into the
      Tournament, as it is officially called, sponsoring their own team, the Corrupt.`,
    releaseDate: "September 30, 2002",
  },
  "ut-2004": {
    title: "UNREAL TOURNAMENT 2004",
    description: `Unreal Tournament 2004 is a multiplayer first person shooter that combines
      the kill-or-be-killed experience of gladiatorial combat with cutting-edge technology.
      Ten game modes - both team-based and “every man for himself“ -- provide even the most
      hardcore gamer with palm-sweating challenges through unbelievably detailed indoor arenas
      and vast outdoor environments.`,
    releaseDate: "March 16, 2004",
  },
  "ut-3": {
    title: "UNREAL TOURNAMENT 3",
    description: `Unreal Tournament 3 marks the return of the world's premiere first-person
      shooter to the PC, and its debut on the PLAYSTATION 3 system. Unreal Tournament 3 unleashes
      the full power of Unreal Engine 3, taking graphics, gameplay, and challenge to a whole new
      level. Players engage in intense battles with other human players online, or against Unreal
      artificial intelligence that sets the industry standard.`,
    releaseDate: "November 19, 2007",
  },
  "ut-alpha": {
    title: "UNREAL TOURNAMENT 4: ALPHA",
    description: `This was an early (pre-alpha) version of an Unreal Tournament experience that
      was canceled in December, 2018.`,
    releaseDate: "August 13, 2014",
  },
  "ut-champs": {
    title: "UNREAL CHAMPIONSHIP",
    description: `Unreal Tournament 2004 is a multiplayer first person shooter that combines the
      kill-or-be-killed experience of gladiatorial combat with cutting-edge technology. Ten game
      modes - both team-based and “every man for himself“ -- provide even the most hardcore gamer
      with palm-sweating challenges through unbelievably detailed indoor arenas and vast outdoor
      environments.`,
    releaseDate: "March 16, 2004",
  },
  "ut-champs-2": {
    title: "UNREAL CHAMPIONSHIP 2: THE LIANDRI CONFLICT",
    description: `Unreal Championship 2: The Liandri Conflict enhances both single and multiplayer
      gameplay, including all-new player acrobatics, third-person camera mode, vehicles, and
      intense melee abilities. In the single player campaign, you'll fight your way through new
      cities and arenas as Anubis, who attempts to retake his people's Nakhti Rite of Ascension
      Tournament from the machinations of the Liandri Corporation.`,
    releaseDate: "April 18, 2005",
  },
  "open-tournament": {
    title: "OPEN TOURNAMENT",
    description: `Open Tournament is a fast-paced, free-to-play shooter that brings the essence
      of classic competitive FPS games into modern multiplayer action! Experience intense
      multiplayer gameplay with fluid movement, innovative weapons, and a variety of dynamic
      maps & modes.`,
    releaseDate: "To be announced",
  },
};
