import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { downloadUT3Windows } from "./os/windows";

export function downloadUT3(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  downloadUT3Windows(dl, sevenZipLogsCallback);
}
