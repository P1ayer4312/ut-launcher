import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { downloadUT2004Windows } from "./os/windows";

export function downloadUT2004(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  downloadUT2004Windows(dl, sevenZipLogsCallback);
}
