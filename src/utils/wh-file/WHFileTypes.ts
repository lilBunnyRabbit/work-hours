import { isObject } from "../type.util";

export interface IWHFileDay {
  workLogs: Array<{
    id: string;
    from: string;
    to?: string;
    note?: string;
  }>;
  tasks: Array<{
    name: string;
    description?: string;
  }>;
  notes: string[];
  report?: {
    hours: number;
    description: string;
  };
}

export type IWHFileMonth = Partial<Record<number | string, IWHFileDay>>;
export type IWHFileYear = Partial<Record<number | string, IWHFileMonth>>;
export type IWHFileYears = Partial<Record<number | string, IWHFileYear>>;

export interface IWHFile {
  __version: `whf_${number}.${number}.${number}`;
  __lastUpdated: number;
  
  years?: IWHFileYears;
}

export type IWHFileMetadata = Pick<File, "name" | "size" | "type" | "lastModified" | "webkitRelativePath">;

export const isWHFile = (value: unknown): value is IWHFile => {
  const regex = /whf_\d+\.\d+\.\d+/;

  return (
    isObject(value) && "__version" in value && typeof value["__version"] === "string" && regex.test(value["__version"])
  );
};