import { create } from "zustand";

/**
 * @typedef {("unreal"|"ut-1999"|"ut-2004"|"ut-alpha"|
 * "ut-champs-2"|"unreal-2"|"ut-2003"|"ut-3"|"ut-champs"|"blank"
 * )} TSelectedGame
 *
 * @typedef {object} TGlobalState
 * @prop {TSelectedGame} selectedGame
 * @prop {(value: TSelectedGame) => void} setSelectedGame
 *
 * @prop {TSelectedGame | null} downloadingGame
 * @prop {(value: TSelectedGame) => void} setDownloadingGame
 */

/** @type {import("zustand").UseBoundStore<import("zustand").StoreApi<TGlobalState>>} */
export const useGlobalState = create((set) => ({
  selectedGame: "blank",
  setSelectedGame: (value) => set({ selectedGame: value }),

  downloadingGame: null,
  setDownloadingGame: (value) => set({ downloadingGame: value }),
}));
