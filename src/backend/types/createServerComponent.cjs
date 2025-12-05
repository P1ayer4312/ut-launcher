/** @import { useState, Context } from "react" */

// Each game server uses different or similar parameters, so this is a way to
// abstract the base create server component

/**
 * @template T
 * @typedef {ReturnType<typeof useState<T>>} TCreateServerContext
 */

/** @typedef {Context} Context */

/**
 * @typedef {object} CreateServerUnreal
 * @prop {string} AdminEmail
 * @prop {string} AdminName
 * @prop {string} Difficulty
 * @prop {string} GameType
 * @prop {string} MOTDLine1
 * @prop {string} MOTDLine2
 * @prop {string} MOTDLine3
 * @prop {string} MOTDLine4
 * @prop {string} Map
 * @prop {string} MaxPlayers
 * @prop {string} ServerName
 * @prop {string} ShowMOTD
 */
