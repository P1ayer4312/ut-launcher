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

export type TGameKey = "ut-2004" | "ut-2003" | "ut-3";

export type TGameData = {
  directory: string;
  installed: boolean;
  availableOS: (NodeJS.Platform | "")[];
};

export type TContextBridgeGameData = {
  get: (value: TGameId) => Promise<TGameData>;
  set: (key: TGameId, value: Partial<TGameData>) => Promise<void>;
  getLastSelectedGame: () => Promise<TGameId>;
  setLastSelectedGame: (value: TGameId) => Promise<void>;
  selectInstallDir: () => Promise<{ canceled: boolean; filePaths: string[] }>;
  startGameDownload: (gameId: TGameId, installDirectory: string) => Promise<void>;
  stopGameDownload: (gameId: TGameId) => Promise<void>;
  startInstalledGame: (gameId: TGameId) => Promise<void>;
  stopInstalledGame: () => Promise<void>;
  uninstallGame: (gameId: TGameId) => Promise<void>;
  readServerIni: (gameId: TGameId) => Promise<object>;
  saveServerIni: (gameId: TGameId, modifiedFields: object) => Promise<void>;
};

export type TWorkerData = {
  installDirectory: string;
  gameId: TGameId;
};

export type TExeOptions = {
  /** Path of the executable */
  path: string;
  /** Exe arguments */
  args: string[];
};
