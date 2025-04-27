import { create } from "zustand";

/**
 * @typedef {("unreal"|"ut-1999"|"ut-2004"|"ut-alpha"|
 * "ut-champs-2"|"unreal-2"|"ut-2003"|"ut-3"|"ut-champs"
 * )} TSelectedGame
 *
 * @typedef {object} TGlobalState
 * @prop {TSelectedGame} selectedGame
 * @prop {(value: TSelectedGame) => void} setSelectedGame
 */

/** @type {import("zustand").UseBoundStore<import("zustand").StoreApi<TGlobalState>>} */
export const useGlobalState = create((set) => ({
  /** @type {TSelectedGame} */
  selectedGame: "ut-alpha",

  /** @param {TSelectedGame} value */
  setSelectedGame: (value) => set({ selectedGame: value }),
}));
