import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { downloadUT1999Windows } from "./os/windows";

export function downloadUT1999(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  downloadUT1999Windows(dl, sevenZipLogsCallback);
}
