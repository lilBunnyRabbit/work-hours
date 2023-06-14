import { PickPartial } from "../../utils/type.util";
import { WHFileBase, isWHFile } from "../WHFile";

export const VERSION = "whf_0.1.0" satisfies WHFileBase["__version"];

type TimeNumber = `${number}` | `0${number}`;

type TimeFullString = `${TimeNumber}:${TimeNumber}:${TimeNumber}`;

export interface Day {
  workLogs: Array<{
    id: string;
    from: TimeFullString;
    to?: TimeFullString;
    note?: string;
  }>;
  notes: string;
  report?: {
    hours: number;
    notes: string;
  };
}

export type Month = Partial<Record<number | string, Day>>;

export type Year = Partial<Record<number | string, Month>>;

export type Years = Partial<Record<number | string, Year>>;

export default interface WHFile_0_1_0 extends WHFileBase<typeof VERSION> {
  years?: Years;
}

export const INITIAL_DATA: PickPartial<WHFile_0_1_0, "__lastUpdated"> = {
  __version: VERSION,
};

export const INITIAL_DAY: Day = {
  workLogs: [],
  notes: "",
};

export function isWHFile_0_1_0(whFile: unknown): whFile is WHFile_0_1_0 {
  return isWHFile(whFile) && whFile.__version === VERSION;
}
