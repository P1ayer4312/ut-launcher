// Type definitions that I didn't know where to put :)

import type { Endpoints } from "@octokit/types";
import type { TGameId } from "@src/backend/types/gameConfigData.type";

export type TUnreal2Type = "u2-sp" | "u2-xmp";

export type TGameKey = "ut-2004" | "ut-2003" | "ut-3";

export type TContinueModalVariants =
  | "empty"
  | "ut3-key"
  | "message-block"
  | "ut-2003-register-key"
  | "ut-2004-register-key"
  | "ut-2004-install-message";

export type TWorkerData = {
  installDirectory: string;
  gameId: TGameId;
  patchFileLink?: string;
};

export type TExeOptions = {
  /** Path of the executable */
  path: string;
  /** Exe arguments */
  args: string[];
};

export type TScriptName =
  | "installDriversUT4"
  | "registerUT2003key"
  | "registerUT2004key"
  | "replaceUT3EncryptedKey";

export type GithubReleases = Endpoints["GET /repos/{owner}/{repo}/releases"]["response"]["data"];

export type TLauncherSettingsActionNames = "openAppData";

export type TScreenshotData = {
  filePath: string;
  dataBase64: string;
};
