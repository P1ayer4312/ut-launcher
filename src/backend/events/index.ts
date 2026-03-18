import type { BrowserWindow } from "electron";
import { generalHandlers } from "./ipcMainHandlers/generalHandlers";
import { gameDataHandlers } from "./ipcMainHandlers/gameDataHandlers";
import { windowHandlers } from "./ipcMainHandlers/windowHandlers";

export function registerEvents(win: BrowserWindow) {
  windowHandlers(win);
  generalHandlers();
  gameDataHandlers();
}
