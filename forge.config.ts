import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { VitePlugin } from "@electron-forge/plugin-vite";
import { FusesPlugin } from "@electron-forge/plugin-fuses";
import { FuseV1Options, FuseVersion } from "@electron/fuses";
import path from "node:path";
import fs from "node:fs/promises";

type ModuleRef = {
  moduleName: string;
  moduleRootFolder: string;
};

const config: ForgeConfig = {
  hooks: {
    packageAfterCopy: async (_config, buildPath) => {
      // Copy these as external modules
      const modulesToCopy: ModuleRef[] = [
        { moduleName: "js7z-tools", moduleRootFolder: "node_modules" },
        {
          // Even tho local modules are not downloaded from npm, when packaged
          // it searches them from the node_modules folder, so we copy them there
          moduleName: "innoextract-wasm",
          moduleRootFolder: "modules",
        },
      ];

      for (const item of modulesToCopy) {
        const src = path.join(__dirname, item.moduleRootFolder, item.moduleName);
        const dest = path.join(buildPath, "node_modules", item.moduleName);
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.cp(src, dest, { recursive: true });
      }
    },
  },
  packagerConfig: {
    asar: true,
    icon: path.resolve("./public/icon/icon.ico"),
    // Include all assets and extra config files
    extraResource: ["./public", "./src/backend/config"],
  },
  makers: [
    new MakerSquirrel({ setupIcon: path.resolve("./public/icon/icon.ico") }),
    new MakerZIP({}, ["darwin"]),
    new MakerDeb({ options: { icon: path.resolve("./public/icon/icon.png") } }),
    new MakerRpm({}),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: "src/backend/main.ts",
          config: "vite.main.config.mts",
          target: "main",
        },
        {
          entry: "src/backend/preload.ts",
          config: "vite.preload.config.mts",
          target: "preload",
        },
        // We need to transpile the workers from Typescript to JS in order to run them
        {
          entry: "src/backend/workers/downloadGameStepsWorker.ts",
          config: "vite.main.config.mts",
        },
        {
          entry: "src/backend/workers/downloadAndInstallPatchWorker.ts",
          config: "vite.main.config.mts",
        },
      ],
      renderer: [
        {
          name: "main_window",
          config: "vite.renderer.config.mts",
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
