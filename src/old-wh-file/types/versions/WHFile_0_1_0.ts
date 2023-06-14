import { PickPartial } from "../../../utils/type.util";
import { WHFileBase } from "../WHFileTypes";

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

export default interface WHFile_0_1_0 extends WHFileBase<"0.1.0"> {
  years?: Years;
}

export const VERSION: WHFile_0_1_0["__version"] = "whf_0.1.0";

export const INITIAL_DATA: PickPartial<WHFile_0_1_0, "__version" | "__lastUpdated"> = {};

export const INITIAL_DAY: Day = {
  workLogs: [],
  notes: "",
};
