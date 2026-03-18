import type { DownloadManager, SevenZipLogsCallback } from "@src/backend/classes/DownloadManger";
import { downloadUT1999Windows } from "./os/windows";

export function downloadUT1999(dl: DownloadManager, sevenZipLogsCallback: SevenZipLogsCallback) {
  downloadUT1999Windows(dl, sevenZipLogsCallback);
}
