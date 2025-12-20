/** @import { useState, Context } from "react" */

// Each game server uses different or similar parameters, so this is a way to
// abstract the base create server component

/**
 * @template T
 * @typedef {ReturnType<typeof useState<T>>} TCreateServerContext
 */

/** @typedef {Context} Context */

/**
 * @typedef {object} GameType
 * @prop {string} title
 * @prop {string} value
 * @prop {string | null} mapPrefix
 */

/**
 * @typedef {object} CreateServerUnreal
 * @prop {{
 * "ServerName": string[],
 * "AdminName": string[],
 * "AdminEmail": string[],
 * "MOTDLine1": string[],
 * "MOTDLine2": string[],
 * "MOTDLine3": string[],
 * "MOTDLine4": string[]
 * }} Engine_GameReplicationInfo
 * @prop {{
 * "Difficulty": string[],
 * "bAdjustSkill": string[],
 * "bRandomOrder": string[]
 * }} UnrealShare_BotInfo
 * @prop {{
 * "InitialBots": string[],
 * "bMultiPlayerBots": string[]
 * "FragLimit": string[]
 * "TimeLimit": string[]
 * "bHumansOnly": string[]
 * "bCoopWeaponMode": string[]
 * }} UnrealShare_DeathMatchGame
 * @prop {{
 * "GameType": string[]
 * "Map": string[]
 * }} UMenu_UMenuStartGameClientWindow
 * @prop {GameType[]} AllGameTypes
 * @prop {string[]} AllMaps
 * @prop {{
 * "MaxPlayers": string[]
 * "MaxSpectators": string[]
 * }} Engine_GameInfo
 */
