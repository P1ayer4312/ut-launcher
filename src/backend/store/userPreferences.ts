import Store from "electron-store";
import type { TGameId, TGameData } from "@src/backend/types/gameConfigData.type";

const store = new Store();

/** Set config data for a game */
export function setGameUserData(key: TGameId, value: Partial<TGameData>) {
  if (store.has(key)) {
    const current = store.get(key)!;
    store.set(key, { ...current, ...value });
  } else {
    resetStoreForGame(key);
  }
}

/** Get config data for a game */
export function getGameUserData(key: TGameId) {
  if (!store.has(key)) {
    setGameUserData(key, {});
  }

  return store.get(key) as TGameData;
}

// ========================================================================================

const lastSelectedGameStoreKey: string = "lastSelectedGame";

/** Store the last selected game in memory */
export function setLastSelectedGame(value: TGameId) {
  store.set(lastSelectedGameStoreKey, value);
}

/** Return last selected game stored in memory */
export function getLastSelectedGame() {
  if (!store.has(lastSelectedGameStoreKey)) {
    setLastSelectedGame("unreal");
  }

  return store.get(lastSelectedGameStoreKey) as TGameId;
}

// ========================================================================================

export function clearStore() {
  store.clear();
}

// ========================================================================================

/** Reset the local store config for a game */
export function resetStoreForGame(key: TGameId) {
  if (!key) {
    throw new Error(`Unable to reset store for provided game id: ${key}`);
  }

  store.set(key, defaultConfigs[key]);
}

const defaultConfigs: Record<TGameId, TGameData> = {
  unreal: { directory: "", installed: false },
  "unreal-2": { directory: "", installed: false },
  "ut-1999": { directory: "", installed: false },
  "ut-2003": { directory: "", installed: false },
  "ut-2004": { directory: "", installed: false },
  "ut-3": { directory: "", installed: false },
  "ut-alpha": { directory: "", installed: false },
  "ut-champs": { directory: "", installed: false },
  "ut-champs-2": { directory: "", installed: false },
  "open-tournament": { directory: "", installed: false },
};
