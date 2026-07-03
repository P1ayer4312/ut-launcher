import type { Endpoints } from "@octokit/types";
import axios, { type AxiosProgressEvent } from "axios";
import fs from "node:fs";
import path from "node:path";
import { EventEmitter } from "node:events";
import { logger } from "@src/backend/utils/logger";

type CustomEvents = {
  start: [boolean];
  progress: [AxiosProgressEvent];
  progressFormatted: [string];
  error: [string];
  finish: [boolean];
  stop: [boolean];
};

export type LogsCallback = (value: string, customMessage?: string) => void;
export type GithubReleases = Endpoints["GET /repos/{owner}/{repo}/releases"]["response"]["data"];

/**
 * Create download instance, use the `start()` function to
 * begin downloading, `stop()` for terminating the download
 */
export class DownloadManager extends EventEmitter<CustomEvents> {
  urls: string[];
  urlCounter: number;
  /** The location where the game will be installed */
  destination: string;
  abortController: AbortController | null;
  fileName: string;
  /** The `install_files` folder where the game files and patches are downloaded */
  installFilesFolder: string;
  singleFile: boolean;

  /**
   *
   * @param singleFile  When the download is terminated it removes the whole parent folder,
   *                    set it to `true` if you download a single file to remove only that one
   */
  constructor(singleFile: boolean = false) {
    super();
    this.urls = [];
    this.urlCounter = 0;
    this.destination = "";
    this.abortController = null;
    this.fileName = "";
    this.installFilesFolder = "";
    this.singleFile = singleFile;
  }

  /**
   * Provide an array of urls to download
   */
  setUrls(urls: string[]) {
    if (this.singleFile && urls.length > 1) {
      throw new Error(`You can't have "singleFile" enabled and provide more that one url`);
    }

    this.urls = urls;
  }

  /**
   * Define where to install the game and download the files
   */
  setDownloadDestination(destination: string, gameFolderName: string = "") {
    const folderPath = path.resolve(destination, gameFolderName);
    this.destination = folderPath;
    this.installFilesFolder = path.resolve(this.destination, "install_files");
  }

  /**
   * Start the download process
   */
  start() {
    const url = this.urls[this.urlCounter];
    this.fileName = decodeURI(path.basename(url));
    this.abortController = new AbortController();
    const installFilesFullPath = path.resolve(this.installFilesFolder, this.fileName);

    if (!fs.existsSync(this.destination)) {
      fs.mkdirSync(this.destination);
      fs.mkdirSync(this.installFilesFolder);
    }

    if (fs.existsSync(installFilesFullPath)) {
      // Skip existing files
      return this.checkNextDownload();
    }

    this.emit("start", true);

    axios
      .get(url, {
        onDownloadProgress: (progressEvent) => {
          this.emit("progress", progressEvent);
          this.emit("progressFormatted", formatDownloadProgress(progressEvent, this.fileName));
        },
        responseType: "stream",
        signal: this.abortController.signal,
      })
      .then((response) => {
        const pipe = response.data.pipe(fs.createWriteStream(installFilesFullPath));
        pipe.on("finish", () => this.checkNextDownload());
      })
      .catch((err) => {
        const msg = `Error while trying to download: ${url}`;
        logger.error(msg, err);
        this.emit("error", msg);
      });
  }

  private checkNextDownload() {
    this.urlCounter += 1;
    if (this.urlCounter >= this.urls.length) {
      // All urls are downloaded
      this.emit("finish", true);
    } else {
      // Start the next download
      this.start();
    }
  }

  /** Stop the download process */
  async stop() {
    this.abortController?.abort();
    logger.info("Download cancelled, removing: " + this.destination);

    if (this.singleFile) {
      await fs.promises.rm(this.urls[0], { force: true, maxRetries: 5, retryDelay: 200 });
    }
    // else {}
    // TODO: Return this after testing
    // await fs.promises.rm(this.destination, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    this.emit("stop", true);
  }

  /**
   * Helper function that combines the download destination path with a file taken from url
   */
  getFileLocationFromUrl(url: string) {
    const fileName = decodeURI(path.basename(url));
    return path.resolve(this.installFilesFolder, fileName);
  }

  /**
   * Helper function for getting a file path for a given file name inside the download destination path
   */
  getFileLocationForFile(fileName: string) {
    return path.resolve(this.installFilesFolder, fileName);
  }
}

function formatDownloadProgress(info: AxiosProgressEvent, fileName: string) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)}${sizes[i]}`;
  };

  const formatRate = (bytesPerSec: number | undefined) => {
    return bytesPerSec ? `${formatBytes(bytesPerSec)}/s` : "";
  };

  const formatEstimated = (seconds: number | undefined) => {
    if (seconds === 0) return "done";
    if (!seconds || !isFinite(seconds)) return "";

    const totalSec = Math.round(seconds);
    const minutes = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const time = minutes > 0 ? `${minutes} minute(s)` : `${sec} second(s)`;
    return `estimate: ${time}`;
  };

  const downloaded = formatBytes(info.loaded);
  const total = formatBytes(info.total || 0);
  const speed = formatRate(info.rate);
  const eta = formatEstimated(info.estimated);

  return `${downloaded}/${total} ${speed} ${eta} - ${fileName}`;
}
