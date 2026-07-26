import type { TGameId } from "@src/backend/types/gameConfigData.type";

type TCommunityData = {
  discord: string[];
  links?: { title: string; url: string }[];
};

type TCommunityLinks = Partial<Record<TGameId, TCommunityData>>;

export const openTournamentSocial = {
  website: "https://www.opentournamentgame.com/",
  discord: "@____#jxRrDbu",
  reddit: "https://www.reddit.com/r/OpenTournament/",
  steam: "https://store.steampowered.com/app/3249290/Open_Tournament/",
  github: "https://github.com/OpenTournament",
  youtube: "https://www.youtube.com/@OpenTournament",
} as const;

export const communityLinks: TCommunityLinks = {
  unreal: {
    discord: [
      // Official UT
      "@____#unrealtournament",
      // OldUnreal
      "@____#thURucxzs6",
    ],
  },
  "ut-1999": {
    discord: [
      // Official UT
      "@____#unrealtournament",
      // OldUnreal
      "@____#thURucxzs6",
      // UT99.org
      "@____#6CP2UjZ",
    ],
  },
  "unreal-2": { discord: [] },
  "ut-2003": { discord: [] },
  "ut-2004": {
    discord: [
      // Official UT
      "@____#unrealtournament",
      // OldUnreal
      "@____#thURucxzs6",
      // UT2004 Central
      "@____#mb9VrbPJwJ",
      // UT2004 Community
      "@____#tfSAdRwaMf",
    ],
  },
  "ut-3": {
    discord: [
      // Official UT
      "@____#unrealtournament",
      // The UT3 Hub
      "@____#SAk4HmYxC8",
      // UT3 Ultimate
      "@____#UqdYTMqVFR",
    ],
  },
  "ut-alpha": {
    discord: [
      // Official UT
      "@____#unrealtournament",
      // UT4UU
      "@____#2DaCWkK",
      // UTCC
      "@____#abby4YVFqg",
      // UTPugs
      "@____#BbPPCBx",
      // UnrealPUGS
      "@____#unrealpugs",
      // Instagib Nation
      "@____#WF2f6Yb4eR",
    ],
  },
};
