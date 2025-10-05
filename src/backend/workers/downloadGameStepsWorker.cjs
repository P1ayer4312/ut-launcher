const { DownloadManager } = require("../classes/DownloadManger.cjs");
const { downloadUT1999 } = require("./downloadGameSteps/ut-1999.cjs");
const { WorkerHelper } = require("../classes/WorkerHelper.cjs");
const { downloadUT2004 } = require("./downloadGameSteps/ut-2004.cjs");
const { downloadUnreal } = require("./downloadGameSteps/unreal.cjs");

(async () => {
	const dl = new DownloadManager();

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

	/** @param {string} value */
	function sevenZipLogsCallback(value) {
		if (value.includes("%")) {
			const percent = value.match(/(\d+)(?=%)/)[0];
			let parsedNum;
			if (!isNaN(percent) && (parsedNum = Number(percent)) >= 0) {
				WorkerHelper.postMessage("progress", { progress: parsedNum / 100 });
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

		case "ut-2004":
			downloadUT2004(dl, sevenZipLogsCallback);
			break;

		default:
			throw new Error("Invalid gameId provided");
	}
})();
