import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { downloadUT4AlphaWindows } from "./os/windows";

export function downloadUT4Alpha(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  downloadUT4AlphaWindows(dl, sevenZipLogsCallback);
}
