import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { downloadUnrealWindows } from "./os/windows";

export function downloadUnreal(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  downloadUnrealWindows(dl, sevenZipLogsCallback);
}
