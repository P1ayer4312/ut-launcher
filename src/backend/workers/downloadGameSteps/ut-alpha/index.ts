import type { DownloadManager, SevenZipLogsCallback } from "@src/backend/classes/DownloadManger";
import { downloadUT4AlphaWindows } from "./os/windows";

export function downloadUT4Alpha(dl: DownloadManager, sevenZipLogsCallback: SevenZipLogsCallback) {
  downloadUT4AlphaWindows(dl, sevenZipLogsCallback);
}
