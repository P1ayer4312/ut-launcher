/** @import { TGameData, TGameId } from "../types/gameConfigData.cjs" */
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
		resetStoreForGame(key);
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

function clearStore() {
	store.clear();
}

// ========================================================================================

/**
 * Reset the local store config for a game
 * @param {TGameId} key
 */
function resetStoreForGame(key) {
	/** @type {TGameData} */
	const defaultConfig = {
		directory: "",
		patchVersion: null,
		installed: false,
		available: true,
	};

	store.set(key, defaultConfig);
}

module.exports = {
	setGameUserData,
	getGameUserData,
	// ==
	setLastSelectedGame,
	getLastSelectedGame,
	// ==
	clearStore,
	resetStoreForGame,
};
