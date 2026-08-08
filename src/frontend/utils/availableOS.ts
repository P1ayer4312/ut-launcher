import { TGameId } from "@src/backend/types/gameConfigData.type";

type TAvailableOS = Record<TGameId, (NodeJS.Platform | "")[]>;

export const availableOS: TAvailableOS = {
  unreal: ["win32"],
  "unreal-2": ["win32"],
  "ut-1999": ["win32"],
  "ut-2003": ["win32"],
  "ut-2004": ["win32"],
  "ut-3": ["win32"],
  "ut-alpha": ["win32"],
  "ut-champs": [],
  "ut-champs-2": [],
  "open-tournament": [],
};
