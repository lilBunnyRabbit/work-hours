import { PickPartial } from "../../../utils/type.util";
import { WHFileBase } from "../WHFileTypes";

export interface Day {
  workLogs: Array<{
    id: string;
    from: string;
    to?: string;
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

export default interface WHFile_0_0_0 extends WHFileBase<"0.0.0"> {
  years?: Years;
}

export const VERSION: WHFile_0_0_0["__version"] = "whf_0.0.0";

export const INITIAL_DATA: PickPartial<WHFile_0_0_0, "__version" | "__lastUpdated"> = {};

export const INITIAL_DAY: Day = {
  workLogs: [],
  notes: "",
};
