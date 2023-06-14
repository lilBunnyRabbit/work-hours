import migration_0_1_0 from "./migrations/migration_0_1_0";
import {
  isSupportedWHFile,
  isWHFile,
  SUPPORTED_VERSIONS,
  WHFile,
  WHFileBase,
  WHFileMetadata,
} from "./types/WHFileTypes";
import WHFile_0_0_0 from "./types/versions/WHFile_0_0_0";
import WHFile_0_1_0 from "./types/versions/WHFile_0_1_0";

export class WHFileMigrator {
  static migrate(data: WHFileBase & { __version: (typeof SUPPORTED_VERSIONS)[number] }): WHFile.default {
    switch (data.__version) {
      case "whf_0.0.0":
        return this.migrate(migration_0_1_0(data as WHFile_0_0_0));

      case "whf_0.1.0":
        return data as WHFile_0_1_0;

      default:
        throw new Error(`No migration for "Work Hours File" version "${data.__version}".`);
    }
  }
}
