const { default: axios } = require("axios");
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const path = require("node:path");

/**
 * @extends {EventEmitter<{
 * "start": [boolean],
 * "progress": [axios.AxiosProgressEvent],
 * "progressFormatted": [string],
 * "error": [any],
 * "finish": [boolean],
 * "stop": [boolean]
 * }>}
 */
class DownloadManager extends EventEmitter {
  constructor(url, destination) {
    super();
    this.url = url;
    this.destination = destination;
    this.fileName = decodeURI(path.basename(url));
    this.fullDestinationPath = path.resolve(this.destination, this.fileName);
    this.abortController = null;
  }

  start() {
    this.abortController = new AbortController();
    this.emit("start", true);
    axios
      .get(this.url, {
        onDownloadProgress: (progressEvent) => {
          this.emit("progress", progressEvent);
          this.emit("progressFormatted", formatDownloadProgress(progressEvent));
        },
        responseType: "stream",
        signal: this.abortController.signal,
      })
      .then((response) => {
        const pipe = response.data.pipe(fs.createWriteStream(this.fullDestinationPath));
        pipe.on("finish", () => this.emit("finish", true));
      })
      .catch((err) => this.emit("error", err));
  }

  stop() {
    this.emit("stop", true);
    this.abortController.abort();
    fs.rmSync(this.fullDestinationPath);
  }
}

function formatDownloadProgress(info) {
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)}${sizes[i]}`;
  };

  const formatRate = (bytesPerSec) => {
    return bytesPerSec ? `${formatBytes(bytesPerSec)}/s` : "";
  };

  const formatEstimated = (seconds) => {
    if (seconds === 0) return "done";
    if (!seconds || !isFinite(seconds)) return "";

    const totalSec = Math.round(seconds);
    const minutes = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const time = minutes > 0 ? `${minutes} minute(s)` : `${sec} second(s)`;
    return `estimate: ${time}`;
  };

  const downloaded = formatBytes(info.loaded);
  const total = formatBytes(info.total);
  const speed = formatRate(info.rate);
  const eta = formatEstimated(info.estimated);

  return `${downloaded}/${total} ${speed} ${eta}`;
}

module.exports = DownloadManager;
