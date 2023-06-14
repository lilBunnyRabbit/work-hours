import { CustomError } from "../../utils/error.util";
import { WHFile, WHFileBase } from "../WHFile";
import migration_0_0_0 from "../migrations/migration_0_0_0";
import migration_0_1_0 from "../migrations/migration_0_1_0";
import { VERSION as VERSION_0_0_0, isWHFile_0_0_0 } from "../versions/whf_0_0_0";
import { VERSION as VERSION_0_1_0, isWHFile_0_1_0 } from "../versions/whf_0_1_0";
import { WHFileService } from "./whFile.service";

export const SUPPORTED_VERSIONS = [VERSION_0_0_0, VERSION_0_1_0] satisfies WHFileBase["__version"][];

export type SupportedVersions = (typeof SUPPORTED_VERSIONS)[number];

export function isSupportedWHFile(whFile: WHFileBase): whFile is WHFileBase<SupportedVersions> {
  return SUPPORTED_VERSIONS.includes(whFile["__version"] as SupportedVersions);
}

export function isLatestVersion(whFile: WHFileBase): whFile is WHFile.default {
  return whFile.__version === WHFile.VERSION;
}

export interface MigrationConfig<TFile extends WHFileBase, TNext extends WHFileBase> {
  migration(whFile: TFile): TNext;
  is(whFile: unknown): whFile is TFile;
}

export const migrations: Record<WHFileBase["__version"], MigrationConfig<WHFileBase, WHFileBase>> = {
  "whf_0.0.0": {
    migration: migration_0_0_0,
    is: isWHFile_0_0_0,
  },
  "whf_0.1.0": {
    migration: migration_0_1_0,
    is: isWHFile_0_1_0,
  },
};

export class WHFileMigrationService {
  public count = 0;

  public migrate<TVersion extends WHFileBase["__version"]>(
    whFile: WHFileBase<TVersion>,
    log?: string[]
  ): [whFile: WHFile.default, log?: string[]] {
    if (log?.length && log.length > SUPPORTED_VERSIONS.length) {
      throw new CustomError("Internal Error", `Failed to migrate "${WHFileService.NAME}" to the latest version.`);
    }

    if (isLatestVersion(whFile)) return [whFile, log];

    const config = migrations[whFile.__version];
    if (!config) {
      throw new Error(`No migration for "${WHFileService.NAME}" version "${whFile.__version}".`);
    }

    if (!config.is(whFile)) {
      throw new Error(`Invalid "${WHFileService.NAME}" for migration "${config.migration.name}".`);
    }

    const migrated = config.migration(whFile);

    return this.migrate(migrated, [...(log || []), `migrated from "${whFile.__version}" to "${migrated.__version}".`]);
  }
}

export default new WHFileMigrationService();
