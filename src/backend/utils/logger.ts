import log from "electron-log/node";

export const logger = log.scope("    main");
export const workerLog = log.scope("  worker");
export const ipcLogger = log.scope(" <=  ipc");
