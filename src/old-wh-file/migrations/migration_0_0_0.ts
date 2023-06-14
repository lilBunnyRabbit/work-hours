import * as WHFile_0_0_0 from "../types/versions/WHFile_0_0_0";

export default function migration_0_0_0(): WHFile_0_0_0.default {
  return {
    __version: WHFile_0_0_0.VERSION,
    __lastUpdated: Date.now(),
    ...WHFile_0_0_0.INITIAL_DATA,
  };
}
