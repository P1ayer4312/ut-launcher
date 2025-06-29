/** @import { TGameData, TGameId } from "../types/gameConfigData.cjs" */
const os = require("node:os");
const path = require("node:path");
const Store = require("electron-store");

const store = new Store();

/**
 * Set config data for a game
 * @param {TGameId} key
 * @param {TGameData} value
 */
function setGameUserData(key, value) {
  if (store.has(key)) {
    const current = store.get(key);
    store.set(key, { ...current, ...value });
  } else {
    /** @type {TGameData} */
    const defaultConfig = {
      directory: defaultDirectoryPath(),
      patchVersion: null,
      installed: false,
      available: true,
    };

    store.set(key, defaultConfig);
  }
}

/**
 * Get config data for a game
 * @param {TGameId} key
 * @returns {TGameData}
 */
function getGameUserData(key) {
  if (!store.has(key)) {
    setGameUserData(key, {});
  }

  return store.get(key);
}

// ========================================================================================

const lastSelectedGameStoreKey = "lastSelectedGame";

/**
 * Store the last selected game in memory
 * @param {TGameId} value
 */
function setLastSelectedGame(value) {
  store.set(lastSelectedGameStoreKey, value);
}

/**
 * Return last selected game stored in memory
 * @returns {TGameId}
 */
function getLastSelectedGame() {
  if (!store.has(lastSelectedGameStoreKey)) {
    setLastSelectedGame("unreal");
  }

  return store.get(lastSelectedGameStoreKey);
}

// ========================================================================================

function defaultDirectoryPath() {
  return path.resolve(os.homedir(), "Documents", "ut-games");
}

// ========================================================================================

function clearStore() {
  store.clear();
}

module.exports = {
  setGameUserData,
  getGameUserData,
  // ==
  setLastSelectedGame,
  getLastSelectedGame,
  // ==
  clearStore,
};
