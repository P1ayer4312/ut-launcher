import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { downloadUnreal2Windows } from "./os/windows";

export function downloadUnreal2(dl: DownloadManager, innoextractLogsCallback: LogsCallback) {
  downloadUnreal2Windows(dl, innoextractLogsCallback);
}
