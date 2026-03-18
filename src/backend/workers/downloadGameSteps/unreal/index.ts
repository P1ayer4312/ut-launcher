import type { DownloadManager, SevenZipLogsCallback } from "@src/backend/classes/DownloadManger";
import { downloadUnrealWindows } from "./os/windows";

export function downloadUnreal(dl: DownloadManager, sevenZipLogsCallback: SevenZipLogsCallback) {
  downloadUnrealWindows(dl, sevenZipLogsCallback);
}
