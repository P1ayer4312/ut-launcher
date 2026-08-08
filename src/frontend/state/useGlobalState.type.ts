import type { TContinueModalVariants } from "@src/backend/types/customTypes.type";
import type { TGameData } from "@src/backend/types/gameConfigData.type";

export type TGameId =
  | "unreal"
  | "ut-1999"
  | "ut-2004"
  | "ut-alpha"
  | "ut-champs-2"
  | "unreal-2"
  | "ut-2003"
  | "ut-3"
  | "ut-champs"
  | "open-tournament"
  | "blank";

export type TProgressBar = {
  text: string;
  percentage: number;
};

export type TLocalDataStore = Partial<Record<TGameId, Partial<TGameData>>>;

export type TModalData = {
  isOpened: boolean;
  modalType: "blank" | "uninstall" | "continue" | "error" | "launcher-settings" | "guide" | "reinstall";
  errorModalText: string | null;
  continueModalText: string | null;
  continueModalVariant: TContinueModalVariants;
};

export interface TGlobalState {
  selectedGame: TGameId;
  setSelectedGame: (value: TGameId) => void;

  runningGame: TGameId | null;
  setRunningGame: (value: TGameId | null) => void;

  downloadingGame: TGameId | null;
  setDownloadingGame: (value: TGameId | null) => void;

  progressBar: TProgressBar;
  setProgressBar: (value: Partial<TProgressBar>) => void;

  /** Store games' configs in the global state */
  localDataStore: TLocalDataStore;
  setLocalDataStore: (value: TLocalDataStore) => void;
  setLocalDataStoreForGameId: (key: TGameId, value: Partial<TGameData>) => void;

  modalData: TModalData;
  setModalData: (value: Partial<TModalData>) => void;

  platform: NodeJS.Platform | "";
  setPlatform: (value: NodeJS.Platform) => void;

  /**
   * Returns true if another game is being played,
   * being downloaded or getting reinstalled
   */
  isOtherGameActive: () => boolean;
}
