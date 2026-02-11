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
  const defaultConfig: TGameData = {
    directory: "",
    patchVersion: null,
    installed: false,
    available: true,
  };

  store.set(key, defaultConfig);
}
