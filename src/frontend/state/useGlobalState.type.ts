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
  | "blank";

export type TProgressBar = {
  text: string;
  percentage: number;
};

export type TLocalDataStore = Partial<Record<TGameId, TGameData>>;

export type TModalData = {
  isOpened: boolean;
  modalType: "blank" | "uninstall" | "confirm" | "error";
  errorModalText: string | null;
};

export interface TGlobalState {
  selectedGame: TGameId;
  setSelectedGame: (value: TGameId) => void;

  runningGame: TGameId | null;
  setRunningGame: (value: TGameId) => void;

  downloadingGame: TGameId | null;
  setDownloadingGame: (value: TGameId | null) => void;

  progressBar: TProgressBar;
  setProgressBar: (value: TProgressBar) => void;

  /** Store games' configs in the global state */
  localDataStore: TLocalDataStore;
  setLocalDataStore: (value: TLocalDataStore) => void;
  setLocalDataStoreForGameId: (key: TGameId, value: TGameData) => void;

  modalData: TModalData;
  setModalData: (value: TModalData) => void;
}
