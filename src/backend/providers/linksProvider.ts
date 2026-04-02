import type { TGameId } from "@src/backend/types/gameConfigData.type";

type TLinks = {
  gameFiles: string;
  patch: string | null;
  installer: string | null;
};

type TLinksPerEnv = {
  dev: TLinks;
  prod: TLinks;
};

type TLinksProvider = Partial<Record<TGameId, TLinksPerEnv>>;

export const linksProvider: TLinksProvider = {
  unreal: {
    dev: {
      gameFiles: "http://localhost:3000/UNREAL_GOLD.ISO",
      patch: "http://localhost:3000/OldUnreal-UnrealPatch227k-Windows.zip",
      installer: null,
    },
    prod: {
      gameFiles: "https://files.oldunreal.net/UNREAL_GOLD.ISO",
      patch: "https://api.github.com/repos/OldUnreal/Unreal-testing/releases",
      installer: "https://www.oldunreal.com/site/assets/files/1106/unreal_gold.zip",
    },
  },
  "unreal-2": {
    dev: {
      gameFiles: "http://localhost:3000/setup_unreal_2_-_the_awakening_special_edition_v2001_(19575).exe",
      patch: null,
      installer: null,
    },
    prod: {
      gameFiles:
        "https://archive.org/download/Unreal-GOG-Collection/Unreal%202%20The%20Awakening%20Special%20Edition/setup_unreal_2_-_the_awakening_special_edition_v2001_%2819575%29.exe",
      installer: null,
      patch: null,
    },
  },
  "ut-1999": {
    dev: {
      gameFiles: "http://localhost:3000/UT_CD1_436_Final.iso",
      patch: "http://localhost:3000/OldUnreal-UTPatch469e-Windows-x86.zip",
      installer: "http://localhost:3000/ut_goty.zip",
    },
    prod: {
      gameFiles: "https://archive.org/download/ut-cd-1-436/UT_CD1_436_Final.iso",
      installer: "https://www.oldunreal.com/site/assets/files/1107/ut_goty.zip",
      patch: "https://api.github.com/repos/OldUnreal/UnrealTournamentPatches/releases",
    },
  },
  "ut-2004": {
    dev: {
      gameFiles: "http://localhost:3000/UT2004.zip",
      installer: null,
      patch: null,
    },
    prod: {
      gameFiles: "https://archive.org/download/ut2004-3369/UT2004.zip",
      installer: null,
      patch: null,
    },
  },
  "ut-alpha": {
    // https://archive.org/details/ut-4-windows-build.-7z
    dev: {
      gameFiles: "http://localhost:3000/UT4%20Windows%20Build%20(includes%20Windows%20Server%20binaries).7z",
      installer: null,
      patch: "http://localhost:3000/UT4UU-v10_1_6.zip",
    },
    prod: {
      gameFiles:
        "https://archive.org/download/ut-4-windows-build.-7z/UT4%20Windows%20Build%20%28includes%20Windows%20Server%20binaries%29.7z",
      installer: null,
      patch: "https://api.github.com/repos/timiimit/UT4UU-Public/releases",
    },
  },
};
