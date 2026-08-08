import type { DownloadManager, LogsCallback } from "@src/backend/classes/DownloadManger";
import { FilesHelper } from "@src/backend/classes/FilesHelper";
import { WorkerHelper } from "@src/backend/classes/WorkerHelper";
import { ArchiveManager } from "@src/backend/classes/ArchiveManager";
import { filesMapping, directoriesList } from "@src/backend/config/ut-3/installer-mapping";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

/**
 * Download UT3, patch, extract and configure
 */
export async function downloadUT3Windows(dl: DownloadManager, sevenZipLogsCallback: LogsCallback) {
  const links = WorkerHelper.getGameLinks("ut-3");
  if (!links.patch || !links.installer) {
    throw new Error(`Missing links for ut-3`);
  }

  // Download the game installer and patches
  dl.setUrls([links.installer, links.patch]);

  // Download all necessary files
  await new Promise((resolve, reject) => {
    dl.on("error", reject);
    dl.on("finish", resolve);

    // Start the download
    dl.start();
  });

  // Start extracting files
  WorkerHelper.postMessage("progressFormatted", "Extracting files...");
  WorkerHelper.postMessage("progress", { progress: 1 });

  // Create a folder where the extracted files will be handled
  const tempExtractionFolder = path.resolve(dl.installFilesFolder, "temp_extraction_folder");

  // Remove if there were prior extraction attempts
  await FilesHelper.remove(tempExtractionFolder);
  await FilesHelper.remove(path.resolve(os.homedir(), "Documents/My Games/Unreal Tournament 3"));
  await FilesHelper.removeOldFiles(dl.destination);

  fs.mkdirSync(tempExtractionFolder);

  // Copy the skip files list inside the extraction folder
  await FilesHelper.copyFile(
    FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-3/skip.txt"),
    tempExtractionFolder,
  );

  await FilesHelper.copyFile(
    FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-3/skip_patch.txt"),
    tempExtractionFolder,
  );

  await FilesHelper.copyFile(
    FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-3/skip_patch_archive.txt"),
    dl.installFilesFolder,
  );

  const openSpyPatch = path.resolve(dl.installFilesFolder, "UT3_OS_Patch.zip");
  if (!fs.existsSync(openSpyPatch)) {
    await FilesHelper.copyFile(
      FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-3/UT3_OS_Patch.zip"),
      dl.installFilesFolder,
    );
  }

  // Extract the .iso file inside the .zip
  await ArchiveManager.extractFiles(
    dl.getFileLocationFromUrl(links.installer),
    tempExtractionFolder,
    (value) => sevenZipLogsCallback(value, "Extracting .iso from .zip..."),
  );

  // Extract .cab files from the .iso installation files
  const isoFile = path.resolve(tempExtractionFolder, "Unreal Tournament III (USA) (En,Fr,De,Es).iso");
  await ArchiveManager.extractFilesWithIgnore(isoFile, tempExtractionFolder, "skip.txt", (value) => {
    sevenZipLogsCallback(value, "Extracting .cab files from .iso...");
  }).then(() => {
    // Remove the .iso file to clean up space
    return fs.promises.rm(isoFile);
  });

  // Some .cab files are split in two chunks, remove both .cab files after extracting the main one
  // We'll pre-map each .cab location to ease it up a bit
  // prettier-ignore
  const cabFiles = [
    ["Data1.cab", "Data11.cab"], ["Data2.cab", "Data21.cab"], ["Data3.cab", "Data31.cab"],
    ["Data4.cab", "Data41.cab"], ["Data5.cab", "Data51.cab"], ["Data6.cab", "Data61.cab"],
    ["Data7.cab", "Data71.cab"], ["Data8.cab", "Data81.cab"], ["Data9.cab"],
  ].map((cabs) => cabs.map((item) => path.resolve(tempExtractionFolder, item)));

  // Extract each .cab file and remove it after it being extracted
  for (let n = 0; n < cabFiles.length; n++) {
    const cabFile = cabFiles[n];
    const cabFilePath = cabFile[0];
    await ArchiveManager.extractFiles(cabFilePath, tempExtractionFolder, (value) => {
      sevenZipLogsCallback(value, `Extracting ${path.basename(cabFile[0])} ${n + 1}/${cabFiles.length}...`);
    }).then(() => {
      // Remove the .cab files to clean up space
      return Promise.all(cabFile.map(FilesHelper.remove));
    });
  }

  // Create the game's folder structure
  WorkerHelper.postMessage("progressFormatted", "Creating game folder structure...");
  WorkerHelper.postMessage("progress", { progress: 1 });

  await Promise.all(
    directoriesList.map((item) => {
      const folder = path.resolve(dl.destination, item);
      if (fs.existsSync(folder)) {
        return Promise.resolve();
      }

      return fs.promises.mkdir(folder, { recursive: true });
    }),
  );

  // Move all hashed game files in their appropriate location
  WorkerHelper.postMessage("progressFormatted", "Group game files in folders...");
  for (const [key, value] of Object.entries(filesMapping)) {
    const hashedFilePath = path.resolve(tempExtractionFolder, key);
    const hashedFileDestination = path.resolve(dl.destination, value);
    await fs.promises.rename(hashedFilePath, hashedFileDestination);
  }

  // Extract the patches in order
  await ArchiveManager.extractFilesWithIgnore(
    dl.getFileLocationFromUrl(links.patch),
    tempExtractionFolder,
    "skip_patch_archive.txt",
    (value) => sevenZipLogsCallback(value, "Extracting patches..."),
  );

  // prettier-ignore
  const patchesList = [
    "UT3Patch1.exe", "UT3Patch2.exe", "UT3BonusPack.exe", "UT3Patch3.exe",
    "UT3Patch4.exe", "UT3TitanPack.exe", "UT3Patch5.exe"
  ];

  for (let n = 0; n < patchesList.length; n++) {
    const patchFile = patchesList[n];
    const patchFilePath = path.resolve(tempExtractionFolder, patchFile);
    await ArchiveManager.extractFilesWithIgnore(
      patchFilePath,
      tempExtractionFolder,
      "skip_patch.txt",
      (value) => sevenZipLogsCallback(value, `Extracting ${patchFile} ${n + 1}/${patchesList.length}...`),
    ).then(() => {
      // Remove the .exe file to clean up space
      return fs.promises.rm(patchFilePath);
    });
  }

  // Move all patch files inside the game
  WorkerHelper.postMessage("progressFormatted", "Moving patch files...");
  WorkerHelper.postMessage("progress", { progress: 1 });
  const extractedPatchPath = path.resolve(tempExtractionFolder, "Patch");
  await FilesHelper.moveAll(extractedPatchPath, dl.destination);

  // Apply OpenSpy patch
  await ArchiveManager.extractFiles(openSpyPatch, path.resolve(dl.destination, "Binaries"), (value) =>
    sevenZipLogsCallback(value, `Extracting OpenSpy patch...`),
  );

  // Create the config folder and copy UTEngine.ini
  const ut3ConfigPath = path.resolve(os.homedir(), "Documents/My Games/Unreal Tournament 3/UTGame/Config");
  await fs.promises.mkdir(ut3ConfigPath, { recursive: true });
  await FilesHelper.copyFile(
    FilesHelper.configFilePath(WorkerHelper.isDev(), "ut-3/UTEngine.ini"),
    ut3ConfigPath,
  );

  // Register product key
  WorkerHelper.postMessage("progressFormatted", "Applying product key...");
  WorkerHelper.postMessage("runScriptFromWorker", "replaceUT3EncryptedKey");

  // Cleanup
  WorkerHelper.postMessage("progressFormatted", "Cleanup...");
  await FilesHelper.remove(tempExtractionFolder);

  // Update the local store for the installed game and tag it as installed
  WorkerHelper.postMessage("updateLocalGameStore", { gameId: "ut-3", installed: true });

  // Stop the worker
  WorkerHelper.exit(0);
}
