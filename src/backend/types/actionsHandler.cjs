/**
 * @typedef {(
 * sendMessage: (event: string, ...message: any[]) => void,
 * incrementActionCounter: () => void
 * ) => void} TActionsHandlerCallback
 *
 * @typedef {object} TActionsHandlerSendMessage
 * @prop {string} key
 * @prop {any} value
 *
 * @typedef {object} TContextBridgeActionsHandler
 * @prop {(callback: (data: TActionsHandlerSendMessage) => void) => Promise<void>} onMessageEvent
 * @prop {(value: string) => Promise<string[]>} fetchScreenshotsFromPath
 * @prop {(value: string) => Promise<void>} open
 * @prop {(value: string) => Promise<void>} copyImgToClipboard
 */
