## Example worker starter for working with ActionsHandler.runWorker

Messages sent from and within the worker should be in a key-value object, or use the `WorkerHelper` class which uses JSDoc typed functions to make development easier.

Both methods in the example do the same thing.

```js
const { parentPort } = require("node:worker_threads");
const process = require("node:process");
const { WorkerHelper } = require("../../classes/WorkerHelper.cjs");

(async () => {
	// Method 1
	parentPort.postMessage({ key: "start", value: process.env.gameId });
	parentPort.on("message", (data) => {
		if (data.key === "terminate") {
			process.exit(0);
		}
	});

	// Method 2
	WorkerHelper.postMessage("start", process.env.gameId);
	WorkerHelper.parentPort.on("message", (data) => {
		if (data.key === "terminate") {
			WorkerHelper.exit(0);
		}
	});
})();
```
