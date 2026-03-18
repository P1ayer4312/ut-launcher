import { DownloadManager } from "@src/backend/classes/DownloadManger";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { downloadUnreal } from "./downloadGameSteps/unreal";
import { downloadUT1999 } from "./downloadGameSteps/ut-1999";
import { downloadUT4Alpha } from "./downloadGameSteps/ut-alpha";

(async () => {
  const dl = new DownloadManager();
  if (!WorkerHelper.parentPort) {
    throw new Error(`"parentPort" is not present`);
  }

  dl.on("progressFormatted", (data) => WorkerHelper.postMessage("progressFormatted", data));
  dl.on("progress", (data) => WorkerHelper.postMessage("progress", data));
  dl.on("error", (err) => WorkerHelper.postMessage("error", err));

  dl.setDownloadDestination(WorkerHelper.workerData.installDirectory, WorkerHelper.workerData.gameId);

  WorkerHelper.parentPort.on("message", (data) => {
    if (data.key === "terminate") {
      dl.stop();
      WorkerHelper.exit(0);
    }
  });

  // Add initial value to the progress bar to not look broken
  WorkerHelper.postMessage("progressFormatted", "Preparing...");
  WorkerHelper.postMessage("progress", { progress: 0 });

  function sevenZipLogsCallback(value: string) {
    if (value?.includes("%")) {
      const percent = Number(value.match(/(\d+)(?=%)/)?.[0]);

      if (!isNaN(percent) && percent >= 0) {
        WorkerHelper.postMessage("progress", { progress: percent / 100 });
      }

      WorkerHelper.postMessage("progressFormatted", `Extracting files... ${value}`);
    }
  }

  // Run download steps function for selected game
  switch (WorkerHelper.workerData.gameId) {
    case "unreal":
      downloadUnreal(dl, sevenZipLogsCallback);
      break;

    case "ut-1999":
      downloadUT1999(dl, sevenZipLogsCallback);
      break;

    // case "ut-2004":
    //   downloadUT2004(dl, sevenZipLogsCallback);
    //   break;

    case "ut-alpha":
      downloadUT4Alpha(dl, sevenZipLogsCallback);
      break;

    default:
      throw new Error("Invalid gameId provided");
  }
})();
