export interface WHFile_0_0_0 {
  __version: "whf_0.0.0";
  __lastUpdated: number;

  years?: Partial<
    Record<
      number | string,
      Partial<
        Record<
          number | string,
          Partial<
            Record<
              number | string,
              {
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
            >
          >
        >
      >
    >
  >;
}

export default function migration_0_0_0(): WHFile_0_0_0 {
  return {
    __version: "whf_0.0.0",
    __lastUpdated: Date.now(),
  };
}
