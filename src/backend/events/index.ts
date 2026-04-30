import type { BrowserWindow } from "electron";
import { generalHandlers } from "@src/backend/events/ipcMainHandlers/generalHandlers";
import { gameDataHandlers } from "@src/backend/events/ipcMainHandlers/gameDataHandlers";
import { windowHandlers } from "@src/backend/events/ipcMainHandlers/windowHandlers";
import { registerSessionProtocol } from "@src/backend/events/sessionHandlers/registerSessionProtocol";

export function registerEvents(win: BrowserWindow, partition: string) {
  windowHandlers(win);
  generalHandlers();
  gameDataHandlers();
  registerSessionProtocol(partition);
}
