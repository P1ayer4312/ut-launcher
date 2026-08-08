import log from "electron-log/renderer";

export const logger = log.scope("renderer");
/** Only used for `preload.ts` and renderer */
export const ipcLogger = log.scope(" =>  ipc");
