import { isObject } from "../utils/type.util";

export * as WHFile from "./versions/whf_0_1_0";

export interface WHFileBase<Version extends `whf_${number}.${number}.${number}` = `whf_${number}.${number}.${number}`> {
  __version: Version;
  __lastUpdated: number;
}

export type WHFileMetadata = Pick<File, "name" | "size" | "type" | "lastModified" | "webkitRelativePath">;

export function isWHFile<T extends WHFileBase>(value: unknown): value is T {
  const regex = /whf_\d+\.\d+\.\d+/;

  return (
    isObject(value) && "__version" in value && typeof value["__version"] === "string" && regex.test(value["__version"])
  );
}
