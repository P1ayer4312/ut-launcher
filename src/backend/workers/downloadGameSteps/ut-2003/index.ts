import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { downloadUT2003Windows } from "./os/windows";

export function downloadUT2003(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  downloadUT2003Windows(dl, sevenZipLogsCallback);
}
