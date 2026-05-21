import { TGameKey, TUnreal2Type } from "@src/backend/types/customTypes.type";

export type TGameId =
  | "unreal"
  | "ut-1999"
  | "ut-2004"
  | "ut-alpha"
  | "ut-champs"
  | "ut-champs-2"
  | "unreal-2"
  | "ut-2003"
  | "ut-3";

export type TGameData = {
  directory: string;
  installed: boolean;
  availableOS: (NodeJS.Platform | "")[];
};

export type TReleaseFile = {
  releaseName: string;
  fileName: string;
  url: string;
};

export type TContextBridgeGameData = {
  get: (value: TGameId) => Promise<TGameData>;
  set: (key: TGameId, value: Partial<TGameData>) => Promise<void>;
  getLastSelectedGame: () => Promise<TGameId>;
  setLastSelectedGame: (value: TGameId) => Promise<void>;
  selectInstallDir: () => Promise<{ canceled: boolean; filePaths: string[] }>;
  startGameDownload: (gameId: TGameId, installDirectory: string) => Promise<void>;
  stopGameDownload: (gameId: TGameId) => Promise<void>;
  startInstalledGame: (gameId: TGameId, option?: TUnreal2Type) => Promise<void>;
  stopInstalledGame: () => Promise<void>;
  uninstallGame: (gameId: TGameId) => Promise<void>;
  readServerIni: (gameId: TGameId) => Promise<object>;
  saveServerIni: (gameId: TGameId, modifiedFields: object) => Promise<void>;
  fetchPatchesForGame: (gameId: TGameId) => Promise<TReleaseFile[]>;
  downloadAndInstallPatch: (gameId: TGameId, patchLink: string) => Promise<void>;
  getProductKey: (gameId: TGameKey) => Promise<string>;
};
