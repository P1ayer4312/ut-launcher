import log from "electron-log/main";

export const logger = log.scope("    main");
export const workerLog = log.scope("  worker");
export const ipcLogger = log.scope(" <=  ipc");
