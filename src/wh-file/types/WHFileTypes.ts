import { isObject } from "../../utils/type.util";
import { VERSION as VERSION_0_0_0 } from "./versions/WHFile_0_0_0";

export interface WHFileBase<Version extends `${number}.${number}.${number}` = `${number}.${number}.${number}`> {
  __version: `whf_${Version}`;
  __lastUpdated: number;
}

export type WHFileMetadata = Pick<File, "name" | "size" | "type" | "lastModified" | "webkitRelativePath">;

export function isWHFile<T extends WHFileBase>(value: unknown): value is T {
  const regex = /whf_\d+\.\d+\.\d+/;

  return (
    isObject(value) && "__version" in value && typeof value["__version"] === "string" && regex.test(value["__version"])
  );
}

export const SUPPORTED_VERSIONS = [VERSION_0_0_0] satisfies WHFileBase["__version"][];

export function isSupportedWHFile<T extends WHFileBase>(whFile: T): boolean {
  return SUPPORTED_VERSIONS.includes(whFile["__version"] as typeof SUPPORTED_VERSIONS[number]);
}

export * as WHFile from "./versions/WHFile_0_0_0";
