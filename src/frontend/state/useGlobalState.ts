import { create } from "zustand";
import type { TGlobalState } from "./useGlobalState.type";

export const useGlobalState = create<TGlobalState>()((set) => ({
  selectedGame: "blank",
  setSelectedGame: (value) => set({ selectedGame: value }),
  runningGame: null,
  setRunningGame: (value) => set({ runningGame: value }),
  platform: "",
  setPlatform: (value) => set({ platform: value }),

  downloadingGame: null,
  setDownloadingGame: (value) => set({ downloadingGame: value }),
  progressBar: { percentage: 0, text: "..." },
  setProgressBar: (value) => set((current) => ({ progressBar: { ...current.progressBar, ...value } })),

  localDataStore: {},
  setLocalDataStore: (value) => {
    set((current) => ({ localDataStore: { ...current.localDataStore, ...value } }));
  },
  setLocalDataStoreForGameId: (key, value) => {
    set((current) => ({
      localDataStore: { [key]: { ...current.localDataStore[key], ...value } },
    }));
  },
  modalData: { isOpened: false, modalType: "blank", errorModalText: null },
  setModalData: (value) => {
    set((current) => ({
      modalData: { ...current.modalData, ...value, errorModalText: value.errorModalText ?? null },
    }));
  },
}));
