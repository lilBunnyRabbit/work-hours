import React from "react";
import { sendFileEvent, showNotification } from "../../layouts/Toolbar";
import { WHFileHandler } from "../WHFileHandler";
import whFileService from "../services/whFile.service";
import { WHFile } from "../WHFile";

export interface WHFileContextProps {
  manager: {
    handler: WHFileHandler<WHFile.default>;
    lastSynch: number;
    lastUpdate: number;
    update: (data: WHFile.default) => Promise<void>;
  } | null;
  open: () => Promise<void>;
  create: () => Promise<void>;
}

export const WHFileContext = React.createContext<WHFileContextProps | null>(null);

export interface WHFileProviderProps {
  children: React.ReactNode;
}

export const WHFileProvider: React.FC<WHFileProviderProps> = ({ children }) => {
  const [manager, setManager] = React.useState<Omit<NonNullable<WHFileContextProps["manager"]>, "update"> | null>(null);

  const onHandlerCreate = React.useCallback((handler: WHFileHandler<WHFile.default>) => {
    const currentTimestamp = Date.now();
    setManager({
      handler,
      lastSynch: currentTimestamp,
      lastUpdate: currentTimestamp,
    });
  }, []);

  const open: WHFileContextProps["open"] = React.useCallback(async () => {
    try {
      const handler = await whFileService.open();
      onHandlerCreate(handler);
    } catch (error: any) {
      console.error(error);
      showNotification({
        type: "error",
        title: "Failed to open file",
        description: error?.message,
      });
    }
  }, [onHandlerCreate]);

  const create: WHFileContextProps["create"] = React.useCallback(async () => {
    try {
      const handler = await whFileService.create();
      onHandlerCreate(handler);
    } catch (error: any) {
      console.error(error);
      showNotification({
        type: "error",
        title: "Failed to create file",
        description: error?.message,
      });
    }
  }, [onHandlerCreate]);

  const update: NonNullable<WHFileContextProps["manager"]>["update"] = React.useCallback(
    async (data) => {
      if (manager === null) throw new Error("No initialized manager.");

      try {
        const updated = await whFileService.write.observe({
          writing: (active) => sendFileEvent({ action: "writing", active }),
        })(manager.handler.fileHandle, data);

        manager.handler.data = updated as WHFile.default;

        const timestamp = Date.now();
        setManager((manager) => {
          if (manager === null) return manager;
          return {
            ...manager,
            lastSynch: timestamp,
            lastUpdate: timestamp,
          };
        });
      } catch (error) {
        showNotification({
          type: "error",
          title: "Failed to synch file",
          description: (error as any)?.message,
        });

        manager.handler.data = data as WHFile.default;

        const timestamp = Date.now();
        setManager((manager) => {
          if (manager === null) return manager;
          return {
            ...manager,
            lastUpdate: timestamp,
          };
        });
      }
    },
    [manager]
  );

  const extendedManager = React.useMemo(() => {
    if (manager === null) return manager;
    return {
      ...manager,
      update: update,
    };
  }, [manager, update]);

  React.useEffect(() => {
    console.log("WHFileContext.manager", manager);
  }, [manager]);

  return <WHFileContext.Provider value={{ manager: extendedManager, open, create }} children={children} />;
};
