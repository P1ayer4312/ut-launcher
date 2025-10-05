/** @import { TGameId } from '../types/gameConfigData.cjs' */

/**
 * @typedef {object} TLinks
 * @prop {string} gameFiles
 * @prop {string | null} patch
 * @prop {string | null} installer
 *
 * @typedef {object} TLinksPerEnv
 * @prop {TLinks} dev
 * @prop {TLinks} prod
 *
 * @typedef {Record<TGameId, TLinksPerEnv>} TLinksProvider
 */

/** @type {TLinksProvider} */
const linksProvider = {
	unreal: {
		dev: {
			gameFiles: "http://localhost:3000/UNREAL_GOLD.ISO",
			patch: "http://localhost:3000/OldUnreal-UnrealPatch227k-Windows.zip",
			installer: null,
		},
		prod: {
			gameFiles: "https://files.oldunreal.net/UNREAL_GOLD.ISO",
			patch: "https://api.github.com/repos/OldUnreal/Unreal-testing/releases",
			installer: "https://www.oldunreal.com/site/assets/files/1106/unreal_gold.zip",
		},
	},
	"ut-1999": {
		dev: {
			gameFiles: "http://localhost:3000/UT_CD1_436_Final.iso",
			patch: "http://localhost:3000/OldUnreal-UTPatch469e-Windows-x86.zip",
			installer: "http://localhost:3000/ut_goty.zip",
		},
		prod: {
			gameFiles: "https://archive.org/download/ut-cd-1-436/UT_CD1_436_Final.iso",
			installer: "https://www.oldunreal.com/site/assets/files/1107/ut_goty.zip",
			patch: "https://api.github.com/repos/OldUnreal/UnrealTournamentPatches/releases",
		},
	},
	"ut-2004": {
		dev: {
			gameFiles: "http://localhost:3000/UT2004.zip",
			installer: null,
			patch: null,
		},
		prod: {
			gameFiles: "https://archive.org/download/ut2004-3369/UT2004.zip",
			installer: null,
			patch: null,
		},
	},
};

module.exports = { linksProvider };
