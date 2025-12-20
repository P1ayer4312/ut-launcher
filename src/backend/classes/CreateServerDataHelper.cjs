/** @import { TGameId } from "../types/gameConfigData.cjs" */
/** @import { GameType } from "../types/createServerComponent.cjs" */
const { getGameUserData } = require("../store/userPreferences.cjs");
const { IniHelper } = require("../classes/IniHelper.cjs");
const path = require("node:path");
const fs = require("node:fs");

class CreateServerDataHelper {
	/**
	 * Returns a list of maps for a selected game
	 * @param {TGameId} gameId
	 */
	static async readServerIni(gameId) {
		if (gameId === "unreal") {
			const filePath = "System64/Unreal.ini";
			const gameData = getGameUserData(gameId);
			const gameFolderFilePath = path.resolve(gameData.directory, gameId, filePath);
			const ini = new IniHelper(true);
			await ini.readFile(gameFolderFilePath);

			// prettier-ignore
			const Engine_GameReplicationInfo = ini.getValuesFromSection(
        "Engine.GameReplicationInfo",
        ["ServerName", "AdminName", "AdminEmail", "MOTDLine1", "MOTDLine2", "MOTDLine3", "MOTDLine4"]
      );
			// prettier-ignore
			const UnrealShare_BotInfo = ini.getValuesFromSection(
        "UnrealShare.BotInfo",
        ["Difficulty", "bAdjustSkill", "bRandomOrder"]
      );
			// prettier-ignore
			const UnrealShare_DeathMatchGame = ini.getValuesFromSection(
        "UnrealShare.DeathMatchGame",
        ["InitialBots", "bMultiPlayerBots", "FragLimit", "TimeLimit", "bHumansOnly", "bCoopWeaponMode"]
        // bCoopWeaponMode is inverted (true => false)
      );
			// prettier-ignore
			const UMenu_UMenuStartGameClientWindow = ini.getValuesFromSection(
        "UMenu.UMenuStartGameClientWindow",
        ["GameType", "Map"]
      );
			// prettier-ignore
			const Engine_GameInfo = ini.getValuesFromSection(
        "Engine.GameInfo",
        ["MaxPlayers", "MaxSpectators"]
      );

			const AllMaps = CreateServerDataHelper.getGameMapsNames("unreal");
			const AllGameTypes = CreateServerDataHelper.getGameTypes("unreal");
			// prettier-ignore
			return {
        ...Engine_GameReplicationInfo, ...UnrealShare_BotInfo, ...UMenu_UMenuStartGameClientWindow,
        ...UnrealShare_DeathMatchGame, ...Engine_GameInfo, AllMaps, AllGameTypes
      };
		}

		return {};
	}

	/**
	 * Returns a list of maps for a selected game
	 * @param {TGameId} gameId
	 */
	static getGameMapsNames(gameId) {
		const gameData = getGameUserData(gameId);
		const gameFolder = gameData.directory;

		if (gameId === "unreal") {
			const mapsPath = path.resolve(gameFolder, "unreal/MAPS");
			const mapNames = fs
				.readdirSync(mapsPath, { recursive: true })
				.map((item) => path.basename(item, ".unr"))
				.filter((item) => {
					// prettier-ignore
					return ![
						"Benchmark", "Endgame",	"Entry", "EntryII",	"EntryIII",	"Entry_MP",
						"UGCredits", "Unreal",	"UPak",	"End", "Intro1", "Intro2", "Upack"
					].includes(item);
				});

			return mapNames;
		}
	}

	/**
	 * Hard coded for now, might be picked dynamically in the future
	 * @param {TGameId} gameId
	 * @returns {GameType[]}
	 */
	static getGameTypes(gameId) {
		if (gameId === "unreal") {
			return [
				{ title: "CloakGame", mapPrefix: "dm", value: "UPak.CloakGame" },
				{ title: "CloakMatch", mapPrefix: "dm", value: "UPak.CloakMatch" },
				{ title: "CoopGame", mapPrefix: null, value: "UnrealShare.CoopGame" },
				{ title: "DarkMatch", mapPrefix: "dk", value: "UnrealI.DarkMatch" },
				{ title: "DeathMatch", mapPrefix: "dm", value: "UnrealShare.DeathMatchGame" },
				{ title: "GravityMatch", mapPrefix: "dm", value: "UPak.GravityMatch" },
				{ title: "KingOfTheHill", mapPrefix: "dm", value: "UnrealI.KingOfTheHill" },
				{ title: "MarineMatch", mapPrefix: "dm", value: "UPak.MarineMatch" },
				{ title: "TeamGame-DeathMatch", mapPrefix: "dm", value: "UnrealShare.TeamGame" },
				{ title: "TerranWeaponMatch", mapPrefix: "dm", value: "UPak.TerranWeaponMatch" },
				{ title: "UPakCoopGame", mapPrefix: null, value: "UPak.UPakCoopGame" },
			];
		}

		// Invalid gameId passed
		return [{ title: "UNDEFINED_GAME_TYPES", mapPrefix: null }];
	}
}

module.exports = { CreateServerDataHelper };
