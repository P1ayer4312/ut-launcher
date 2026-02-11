import type { BrowserWindow } from "electron";
import { generalHandlers } from "./ipcMainHandlers/generalHandlers";
import { gameDataHandlers } from "./ipcMainHandlers/gameDataHandlers";

export function registerEvents(win: BrowserWindow) {
  generalHandlers(win);
  gameDataHandlers();
}
