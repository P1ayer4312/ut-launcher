import type { DownloadManager, SevenZipLogsCallback } from "@src/backend/classes/DownloadManger";
import { downloadUnreal2Windows } from "./os/windows";

export function downloadUnreal2(dl: DownloadManager, innoextractLogsCallback: SevenZipLogsCallback) {
  downloadUnreal2Windows(dl, innoextractLogsCallback);
}
