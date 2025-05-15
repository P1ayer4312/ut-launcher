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
      patchVersion: "",
      installed: false,
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

function defaultDirectoryPath() {
  return path.resolve(os.homedir(), "Documents", "ut-games");
}

module.exports = { setGameUserData, getGameUserData };
