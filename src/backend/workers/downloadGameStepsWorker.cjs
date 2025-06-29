/** @import { TWorkerData } from "../types/gameConfigData.cjs" */
const { parentPort, workerData: _workerData } = require("node:worker_threads");
const process = require("node:process");
const DownloadManager = require("../classes/DownloadManger.cjs");
const downloadUT1999 = require("./downloadGameSteps/ut-1999.cjs");

/** @type {TWorkerData} */
const workerData = _workerData;

(async () => {
	const dl = new DownloadManager();

	dl.on("progressFormatted", (data) => parentPort.postMessage({ key: "progressFormatted", value: data }));
	dl.on("progress", (data) => parentPort.postMessage({ key: "progress", value: data }));
	dl.on("error", (err) => parentPort.postMessage({ key: "error", value: err }));

	parentPort.postMessage({ key: "start", value: workerData.gameId });
	parentPort.on("message", (data) => {
		if (data.key === "terminate") {
			dl.stop();
			process.exit(0);
		}
	});

	// Add initial value to the progress bar to not look broken
	parentPort.postMessage({ key: "progressFormatted", value: "Preparing..." });
	parentPort.postMessage({ key: "progress", value: { progress: 0 } });

	/** @param {string} value */
	function sevenZipLogsCallback(value) {
		if (value.includes("%")) {
			parentPort.postMessage({ key: "progressFormatted", value: `Extracting files... ${value}` });
		}
	}

	// Run download steps function for selected game
	if (workerData.gameId === "ut-1999") {
		downloadUT1999(dl, sevenZipLogsCallback);
	}
})();
