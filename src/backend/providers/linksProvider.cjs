/** @import { TGameId } from '../types/gameConfigData.cjs' */

/**
 * @typedef {object} TLinks
 * @prop {string} gameFiles
 * @prop {string} patch
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
		dev: {},
		prod: {},
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
};

module.exports = { linksProvider };
