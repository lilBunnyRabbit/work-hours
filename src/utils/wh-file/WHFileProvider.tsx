import React from "react";
import { WHFile } from "./WHFile";
import { WHFileContext, WHFileContextProps } from "./WHFileContext";

export interface WHFileProviderProps {
  children: React.ReactNode;
}

export const WHFileProvider: React.FC<WHFileProviderProps> = ({ children }) => {
  const [whFile, setWHFile] = React.useState<WHFileContextProps["whFile"]>(null);
  const [data, setData] = React.useState<WHFileContextProps["data"]>(null);
  const [metadata, setMetadata] = React.useState<WHFileContextProps["metadata"]>(null);

  const handleOpen: WHFileContextProps["open"] = React.useCallback(async () => {
    try {
      const [whFile, data, metadata] = await WHFile.open();
      setWHFile(whFile);
      setData(data);
      setMetadata(metadata);
    } catch (error) {
      console.error(error);
      // TODO: Notification
    }
  }, []);

  const handleCreate: WHFileContextProps["create"] = React.useCallback(async () => {
    try {
      const [whFile, data, metadata] = await WHFile.create();
      setWHFile(whFile);
      setData(data);
      setMetadata(metadata);
    } catch (error) {
      console.error(error);
      // TODO: Notification
    }
  }, []);

  const handleWrite: WHFileContextProps["write"] = React.useCallback(
    async (data) => {
      if (!whFile) {
        // TODO: Notification
        return;
      }

      try {
        await whFile.write(data);
        setData(data);
      } catch (error) {
        console.error(error);
        // TODO: Notification
      }
    },
    [whFile]
  );

  return (
    <WHFileContext.Provider
      value={{
        whFile,
        data,
        metadata,
        open: handleOpen,
        create: handleCreate,
        write: handleWrite,
      }}
      children={children}
    />
  );
};
