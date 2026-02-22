import readline from "node:readline";
import fs from "node:fs";

type DataValue = { [key: string]: unknown[] };
type DataFormat = {
  [x: string]: DataValue;
};

export class IniHelper {
  data: DataFormat;
  strict: boolean;
  filePath: string;

  /**
   * @param strict Throw error if a section or key doesn't exist
   */
  constructor(strict: boolean = false) {
    this.data = {};
    this.strict = strict;
    this.filePath = "";
  }

  async readFile(filePath: string) {
    this.data = {};
    this.filePath = filePath;
    let section = "";
    const rl = readline.createInterface({ input: fs.createReadStream(filePath, "utf-8") });

    for await (const line of rl) {
      if (line.startsWith("[") && line.endsWith("]")) {
        section = line.substring(1, line.length - 1);
        this.data[section] = {};
      } else if (line !== "") {
        const key = line.substring(0, line.indexOf("=")).trim();
        const value = line.substring(line.indexOf("=") + 1).trim();
        const param = this.data[section];

        if (Array.isArray(param[key])) {
          param[key].push(value);
        } else {
          param[key] = [value];
        }
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

  getSection(name: string): DataValue {
    const section = this.data[name];
    if (!section) {
      throw new Error(`Invalid section name: ${name}`);
    }

    return section;
  }

  /**
   * @param paramIndex If there are duplicate keys, select which one to be replaced/where to place the value
   */
  setValue(section: string, key: string, value: unknown, paramIndex: number = 0) {
    let sectionData = this.data[section];

    if (this.strict && !sectionData) {
      throw new Error(`Invalid section name: ${section}`);
    } else if (!sectionData) {
      sectionData = this.data[section] = {};
    }

    const foundItem = Object.keys(sectionData).includes(key);
    if (this.strict && !foundItem) {
      throw new Error(`Key "${key}" doesn't exist in section "${section}"`);
    } else if (!foundItem) {
      sectionData[key] = [value];
    } else {
      sectionData[key][paramIndex] = value;
    }
  }

  getData() {
    return this.data;
  }

  getValuesFromSection(section: string, keys: string[]) {
    if (!keys || keys?.length === 0) {
      throw new Error("No parameter names provided");
    }

    const selectedSection = this.getSection(section);
    const neededItems: DataValue = {};
    keys.forEach((key) => {
      neededItems[key] = selectedSection[key];
    });

    return { [section.replace(/\./g, "_")]: neededItems };
  }

  saveFile(filePath: string) {
    const file = fs.createWriteStream(filePath || this.filePath);
    for (const section of Object.keys(this.data)) {
      file.write(`[${section.replace(/_/g, ".")}]\n`);
      for (const item of Object.keys(this.data[section])) {
        this.data[section][item].forEach((value) => {
          file.write(`${item}=${value}\n`);
        });
      }

      file.write("\n");
    }

    file.close();
  }
}
