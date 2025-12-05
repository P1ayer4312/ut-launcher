/** @import { TGameId } from "../types/gameConfigData.cjs" */
const path = require("node:path");
const fs = require("node:fs");
const ini = require("ini");
const { getGameUserData } = require("../store/userPreferences.cjs");

// TODO: Add server mapping for the other games

/** Helper class for working with .ini files */
class IniHelper {
	/**
	 * Read the server ini file from a selected game's folder
	 * @param {TGameId} gameId
	 */
	static readServerIni(gameId) {
		const filePath = "System64/Unreal.ini";
		const gameData = getGameUserData(gameId);
		const gameFolderFilePath = path.resolve(gameData.directory, gameId, filePath);
		const iniData = fs.readFileSync(gameFolderFilePath, { encoding: "utf-8" });

		// const parsedData = require("../../../unreal-dump.json");
		const parsedData = ini.parse(iniData);
		const GameReplicationInfo = parsedData.Engine.GameReplicationInfo;

		// Extract only the needed fields from the ini file
		const fieldsData = {
			ServerName: GameReplicationInfo.ServerName,
			AdminName: GameReplicationInfo.AdminName,
			AdminEmail: GameReplicationInfo.AdminEmail,
			MOTDLine1: GameReplicationInfo.MOTDLine1,
			MOTDLine2: GameReplicationInfo.MOTDLine2,
			MOTDLine3: GameReplicationInfo.MOTDLine3,
			MOTDLine4: GameReplicationInfo.MOTDLine4,
			ShowMOTD: GameReplicationInfo.ShowMOTD,
			GameType: parsedData.UMenu.UMenuStartGameClientWindow.GameType,
			Map: parsedData.UMenu.UMenuStartGameClientWindow.Map,
			MaxPlayers: parsedData.Engine.GameInfo.MaxPlayers,
			Difficulty: parsedData.UnrealShare.BotInfo.Difficulty,
		};

		return fieldsData;
	}

	/**
	 * Save the modified server fields inside the ini file
	 * @param {TGameId} gameId
	 * @param {object} modifiedFields
	 */
	static saveServerIni(gameId, modifiedFields = {}) {
		const filePath = "System64/Unreal.ini";
		const gameData = getGameUserData(gameId);
		const gameFolderFilePath = path.resolve(gameData.directory, gameId, filePath);
		const iniData = fs.readFileSync(gameFolderFilePath, { encoding: "utf-8" });
		const newData = ini.parse(iniData);

		const GameReplicationInfo = newData.Engine.GameReplicationInfo;
		GameReplicationInfo.ServerName = modifiedFields.ServerName;
		GameReplicationInfo.AdminName = modifiedFields.AdminName;
		GameReplicationInfo.AdminEmail = modifiedFields.AdminEmail;
		GameReplicationInfo.MOTDLine1 = modifiedFields.MOTDLine1;
		GameReplicationInfo.MOTDLine2 = modifiedFields.MOTDLine2;
		GameReplicationInfo.MOTDLine3 = modifiedFields.MOTDLine3;
		GameReplicationInfo.MOTDLine4 = modifiedFields.MOTDLine4;
		GameReplicationInfo.ShowMOTD = modifiedFields.ShowMOTD;
		newData.UMenu.UMenuStartGameClientWindow.GameType = modifiedFields.GameType;
		newData.UMenu.UMenuStartGameClientWindow.Map = modifiedFields.Map;
		newData.Engine.GameInfo.MaxPlayers = modifiedFields.MaxPlayers;
		newData.UnrealShare.BotInfo.Difficulty = modifiedFields.Difficulty;

		fs.writeFileSync("./dump.ini", ini.stringify(newData), { encoding: "utf-8" });
	}
}

module.exports = { IniHelper };
