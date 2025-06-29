## Example worker starter for working with ActionsHandler.runWorker

Messages sent from and within the worker should be in a key-value object

```js
const { parentPort } = require("node:worker_threads");
const process = require("node:process");

(async () => {
	parentPort.postMessage({ key: "start", value: process.env.gameId });
	parentPort.on("message", (data) => {
		if (data.key === "terminate") {
			process.exit(0);
		}
	});
})();
```
