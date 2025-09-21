/**
 * @import { TGameId, TGameKey } from "../types/gameConfigData.cjs"
 * @import { AxiosProgressEvent } from "axios"
 *
 * @typedef {object} TContextBridgeActionsHandler
 * @prop {(callback: (data: TActionsHandlerMessageEventData) => void) => Promise<void>} onMessageEvent
 * @prop {(value: string) => Promise<string[]>} fetchScreenshotsFromPath
 * @prop {(value: string) => Promise<void>} open
 * @prop {(value: string) => Promise<void>} copyImgToClipboard
 * @prop {(value: TGameKey) => Promise<void>} registerGameKey //TODO: Revisit the value part
 *
 * @typedef {object} TContextBridgeTitleBar
 * @prop {() => Promise<void>} close
 * @prop {() => Promise<void>} minimize
 * @prop {() => Promise<void>} maximize
 *
 * @typedef {object} TActionsHandlerMessageEventData
 * @prop {TEventKeyNames} key
 * @prop {TEventKeyValueMapping[TEventKeyNames]} value
 *
 * @typedef {{
 * "progressFormatted": string,
 * "progress": AxiosProgressEvent,
 * "screenshot": null,
 * "updateLocalGameStore": { gameId: TGameId, installed: boolean },
 * "setRunningGame": TGameId,
 * "resetRunningGame": null,
 * "uninstallingGameMessage": null,
 * "uninstallFinished": null,
 * "error": any
 * }} TEventKeyValueMapping Map expected value for each key event
 *
 * @typedef {keyof TEventKeyValueMapping} TEventKeyNames List of all event names sent between frontend and backend
 */
