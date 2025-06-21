const { Worker, isMainThread, parentPort } = require("node:worker_threads");
const process = require("node:process");
const { setInterval } = require("node:timers");

if (isMainThread) {
  function createWorker() {
    const worker = new Worker(__filename);
    worker.on("message", (data) => {
      console.log(data);
    });
    worker.on("error", console.log);
    worker.once("exit", () => {
      console.log("Exit called");
      // resolve();
    });
    // });

    // return [promise, worker];
    return worker;
  }

  module.exports = createWorker;
} else {
  let counter = 0;

  setInterval(() => {
    if (counter === 5) {
      parentPort.postMessage("Done");
      process.exit();
    } else {
      console.log(counter++);
    }
  }, 1000);
}
