/** @import { UseBoundStore, StoreApi } from 'zustand' */
/** @import { TGameData } from '../../backend/types/gameConfigData.cjs' */
import { create } from "zustand";

/**
 * @typedef {("unreal"|"ut-1999"|"ut-2004"|"ut-alpha"|
 * "ut-champs-2"|"unreal-2"|"ut-2003"|"ut-3"|"ut-champs"|"blank"
 * )} TGameId
 *
 * @typedef {object} TProgressBar
 * @prop {string} text
 * @prop {number} percentage
 *
 * @typedef {Record<TGameId, TGameData>} TLocalDataStore
 *
 * @typedef {object} TModalData
 * @prop {boolean} isOpened
 * @prop {('uninstall'|'confirm')} modalType
 */

/**
 * @typedef {object} TGlobalState
 * @prop {TGameId} selectedGame
 * @prop {(value: TGameId) => void} setSelectedGame
 *
 * @prop {TGameId | null} runningGame
 * @prop {(value: TGameId) => void} setRunningGame
 *
 * @prop {TGameId | null} downloadingGame
 * @prop {(value: TGameId | null) => void} setDownloadingGame
 *
 * @prop {TProgressBar} progressBar
 * @prop {(value: TProgressBar) => void} setProgressBar
 *
 * @prop {TLocalDataStore} localDataStore Store games' configs in the global state
 * @prop {(value: TLocalDataStore) => void} setLocalDataStore
 * @prop {(key: TGameId, value: TGameData) => void} setLocalDataStoreForGameId
 *
 * @prop {TModalData} modalData
 * @prop {(value: TModalData) => void} setModalData
 */

/** @type {UseBoundStore<StoreApi<TGlobalState>>} */
export const useGlobalState = create((set) => ({
	selectedGame: "blank",
	setSelectedGame: (value) => set({ selectedGame: value }),
	runningGame: null,
	setRunningGame: (value) => set({ runningGame: value }),

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

	modalData: { isOpened: false, modalType: "" },
	setModalData: (value) => {
		set((current) => ({ modalData: { ...current.modalData, ...value } }));
	},
}));
