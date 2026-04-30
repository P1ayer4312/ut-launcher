import { DownloadManager } from "@src/backend/classes/DownloadManger";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { FilesHelper } from "@src/backend/classes/FilesHelper";

// Wasn't really sure how to abstract the patching only part

(async () => {
  if (!WorkerHelper.workerData.patchFileLink) {
    throw new Error("Patch file link not provided");
  }

  if (!WorkerHelper.parentPort) {
    throw new Error(`"parentPort" is not present`);
  }

  const dl = new DownloadManager(true);
  const latestPatchUrl = WorkerHelper.workerData.patchFileLink;
  dl.on("progressFormatted", (data) => WorkerHelper.postMessage("progressFormatted", data));
  dl.on("progress", (data) => WorkerHelper.postMessage("progress", data));
  dl.on("error", (err) => WorkerHelper.postMessage("error", err));

  dl.setDownloadDestination(WorkerHelper.workerData.installDirectory, WorkerHelper.workerData.gameId);
  dl.setUrls([latestPatchUrl]);

  // In some cases patches have the same file name, remove if it exists
  const patchFilePath = dl.getFileLocationFromUrl(latestPatchUrl);
  await FilesHelper.remove(patchFilePath);

  WorkerHelper.parentPort.on("message", async (data) => {
    if (data.key === "terminate") {
      await dl.stop();
      WorkerHelper.exit(0);
    }
  });

  // Add initial value to the progress bar to not look broken
  WorkerHelper.postMessage("progressFormatted", "Preparing...");
  WorkerHelper.postMessage("progress", { progress: 2 });

  function sevenZipLogsCallback(value: string, customMessage?: string) {
    if (value?.includes("%")) {
      const percent = Number(value.match(/(\d+)(?=%)/)?.[0]);
      if (!isNaN(percent) && percent >= 0) {
        WorkerHelper.postMessage("progress", { progress: percent / 100 });
      }

      const message = customMessage || "Extracting files...";
      WorkerHelper.postMessage("progressFormatted", `${message} ${value}`);
    }
  }

  // Download the patch file
  await new Promise((resolve, reject) => {
    dl.on("error", reject);
    dl.on("finish", resolve);

    // Start the download
    dl.start();
  });

  // Patching parts are taken from the game download scripts
  switch (WorkerHelper.workerData.gameId) {
    case "unreal": {
      await ArchiveManager.extractFiles(patchFilePath, dl.destination, sevenZipLogsCallback);
      break;
    }

    case "ut-1999": {
      await ArchiveManager.extractFiles(patchFilePath, dl.destination, sevenZipLogsCallback);
      break;
    }

    case "ut-alpha":
      break;

    default:
      throw new Error("Invalid gameId provided");
  }

  WorkerHelper.postMessage("hideProgressBar", null);
  WorkerHelper.exit(0);
})();
