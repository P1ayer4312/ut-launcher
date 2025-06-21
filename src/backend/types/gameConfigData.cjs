/**
 * @typedef {(
 * "unreal"|"ut-1999"|"ut-2004"|"ut-alpha"|"ut-champs-2"|"unreal-2"|"ut-2003"|"ut-3"|"ut-champs"
 * )} TGameId
 *
 * @typedef {object} TGameData
 * @prop {string} directory
 * @prop {string | null} patchVersion
 * @prop {boolean} installed
 * @prop {boolean} available
 *
 * @typedef {object} TContextBridgeGameData
 * @prop {(value: TGameId) => Promise<TGameData>} get
 * @prop {(key: TGameId, value: TGameData) => Promise<void>} set
 * @prop {() => Promise<TGameId>} getLastSelectedGame
 * @prop {(value: TGameId) => Promise<void>} setLastSelectedGame
 */
