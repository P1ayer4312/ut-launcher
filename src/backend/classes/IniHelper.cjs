const readline = require("node:readline");
const fs = require("node:fs");

class IniHelper {
	/** @typedef {{[x: string]: ({key: string, value: string})[]}} DataFormat */

	/** @param {boolean} strict Throw error if a section or key doesn't exist */
	constructor(strict = false) {
		/** @type {DataFormat} */
		this.data = {};
		this.strict = strict;
		this.filePath = "";
	}

	/** @param {string} filePath */
	async readFile(filePath) {
		this.data = {};
		this.filePath = filePath;
		let section = "";
		const rl = readline.createInterface({ input: fs.createReadStream(filePath, "utf-8") });

		for await (let line of rl) {
			if (line.startsWith("[") && line.endsWith("]")) {
				section = line.substring(1, line.length - 1);
				this.data[section] = [];
			} else if (line !== "") {
				const key = line.substring(0, line.indexOf("=")).trim();
				const value = line.substring(line.indexOf("=") + 1).trim();
				this.data[section].push({ key, value });
			}
		}
	}

	getSections() {
		const keys = Object.keys(this.data);
		if (keys.length === 0) {
			throw new Error('No data present, make sure to load a file using the "readFile" function');
		}

		return keys;
	}

	/** @param {string} name */
	getSection(name) {
		const section = this.data[name];
		if (!section) {
			throw new Error(`Invalid section name: ${name}`);
		}

		return section;
	}

	/**
	 * @param {string} section
	 * @param {string} key
	 * @param {any} value
	 * @param {boolean} append Add key as a duplicate
	 */
	setValue(section, key, value, append = false) {
		let sectionData = this.data[section];

		if (this.strict && !sectionData) {
			throw new Error(`Invalid section name: ${section}`);
		} else if (!sectionData) {
			sectionData = this.data[section] = [];
		}

		if (append) {
			sectionData.push({ key, value: String(value) });
			return;
		}

		const foundItem = sectionData.find((item) => item.key === key);
		if (this.strict && !foundItem) {
			throw new Error(`Key "${key}" doesn't exist in section "${section}"`);
		} else if (!foundItem) {
			sectionData.push({ key, value: String(value) });
		} else {
			foundItem.value = String(value);
		}
	}

	getData() {
		return this.data;
	}

	/**
	 * @param {string} section
	 * @param {string[]} keys
	 */
	getValuesFromSection(section, keys) {
		const selectedSection = this.getSection(section);
		const items = selectedSection.filter((item) => keys.includes(item.key));

		return items;
	}

	/** @param {string} filePath */
	saveFile(filePath) {
		const file = fs.createWriteStream(filePath || this.filePath);

		for (let section of Object.keys(this.data)) {
			file.write(`[${section}]\n`);

			for (let item of this.data[section]) {
				file.write(`${item.key}=${item.value}\n`);
			}

			file.write("\n");
		}

		file.close();
	}
}

module.exports = { IniHelper };
