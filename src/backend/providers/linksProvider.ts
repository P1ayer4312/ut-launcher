import type { TGameId } from "@src/backend/types/gameConfigData.type";

type TLinks = {
  gameFiles: string;
  patch: string | null;
  installer: string | null;
  extraFiles: string[];
};

type TLinksPerEnv = {
  dev: TLinks;
  prod: TLinks;
};

type TLinksProvider = Partial<Record<TGameId, TLinksPerEnv>>;

// npx serve -p 4312
export const linksProvider: TLinksProvider = {
  unreal: {
    dev: {
      gameFiles: "http://localhost:4312/UNREAL_GOLD.ISO",
      patch: "https://api.github.com/repos/OldUnreal/Unreal-testing/releases",
      installer: null,
      extraFiles: ["http://localhost:4312/OldUnreal-UnrealPatch227k-Windows.zip"],
    },
    prod: {
      gameFiles: "https://archive.org/download/totallyunreal/UNREAL_GOLD.ISO",
      patch: "https://api.github.com/repos/OldUnreal/Unreal-testing/releases",
      installer: null,
      extraFiles: [],
    },
  },
  "unreal-2": {
    dev: {
      gameFiles: "http://localhost:4312/setup_unreal_2_-_the_awakening_special_edition_v2001_(19575).exe",
      patch: null,
      installer: null,
      extraFiles: [],
    },
    prod: {
      gameFiles:
        "https://archive.org/download/Unreal-GOG-Collection/Unreal%202%20The%20Awakening%20Special%20Edition/" +
        "setup_unreal_2_-_the_awakening_special_edition_v2001_%2819575%29.exe",
      installer: null,
      patch: null,
      extraFiles: [],
    },
  },
  "ut-1999": {
    dev: {
      gameFiles: "http://localhost:4312/UT_CD1_436_Final.iso",
      patch: "https://api.github.com/repos/OldUnreal/UnrealTournamentPatches/releases",
      installer: null,
      extraFiles: ["http://localhost:4312/OldUnreal-UTPatch469e-Windows-x86.zip"],
    },
    prod: {
      gameFiles: "https://archive.org/download/ut-cd-1-436/UT_CD1_436_Final.iso",
      patch: "https://api.github.com/repos/OldUnreal/UnrealTournamentPatches/releases",
      installer: null,
      extraFiles: [],
    },
  },
  "ut-2004": {
    dev: {
      gameFiles: "http://localhost:4312/UT2004.zip",
      installer: null,
      patch: null,
      extraFiles: [],
    },
    prod: {
      gameFiles: "https://archive.org/download/ut2004-3369/UT2004.zip",
      installer: null,
      patch: null,
      extraFiles: [],
    },
  },
  "ut-3": {
    dev: {
      gameFiles: "",
      installer: "http://localhost:4312/Unreal%20Tournament%20III%20(USA)%20(En,Fr,De,Es).zip",
      patch: "http://localhost:4312/Official%20Patches.zip",
      extraFiles: [],
    },
    prod: {
      gameFiles: "",
      installer:
        "https://archive.org/download/ut3-ce-pc/Unreal%20Tournament%20III%20-%20Collector%27s%20Edition/" +
        "Unreal%20Tournament%20III%20%28USA%29%20%28En%2CFr%2CDe%2CEs%29.zip",
      patch:
        "https://archive.org/download/ut3-ce-pc/Unreal%20Tournament%20III%20-%20Collector%27s%20Edition/Official%20Patches.zip",
      extraFiles: [],
    },
  },
  "ut-alpha": {
    // https://archive.org/details/ut-4-windows-build.-7z
    dev: {
      gameFiles: "http://localhost:4312/UT4%20Windows%20Build%20(includes%20Windows%20Server%20binaries).7z",
      installer: null,
      patch: "https://api.github.com/repos/timiimit/UT4UU-Public/releases",
      extraFiles: ["http://localhost:4312/UT4UU-v10_1_6.zip"],
    },
    prod: {
      gameFiles:
        "https://archive.org/download/ut-4-windows-build.-7z/UT4%20Windows%20Build%20%28includes%20Windows%20Server%20binaries%29.7z",
      installer: null,
      patch: "https://api.github.com/repos/timiimit/UT4UU-Public/releases",
      extraFiles: [],
    },
  },
};
