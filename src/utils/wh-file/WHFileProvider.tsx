import React from "react";
import { showNotification } from "../../layouts/Toolbar";
import { WHFile } from "./WHFile";
import { WHFileContext, WHFileContextProps } from "./WHFileContext";

export interface WHFileProviderProps {
  children: React.ReactNode;
}

export const WHFileProvider: React.FC<WHFileProviderProps> = ({ children }) => {
  const [whFile, setWHFile] = React.useState<WHFileContextProps["whFile"]>(null);
  const [data, setData] = React.useState<WHFileContextProps["data"]>(null);
  const [metadata, setMetadata] = React.useState<WHFileContextProps["metadata"]>(null);

  React.useEffect(() => {
    console.log("WHFileProvider", data);
  }, [data]);

  const handleOpen: WHFileContextProps["open"] = React.useCallback(async () => {
    try {
      const [whFile, data] = await WHFile.open();
      setWHFile(whFile);
      setData(data);
      setMetadata(whFile.metadata);
    } catch (error: any) {
      console.error(error);
      showNotification({
        type: "error",
        title: "Failed to open file",
        description: error?.message,
      });
    }
  }, []);

  const handleCreate: WHFileContextProps["create"] = React.useCallback(async () => {
    try {
      const [whFile, data] = await WHFile.create();
      setWHFile(whFile);
      setData(data);
      setMetadata(whFile.metadata);
    } catch (error: any) {
      console.error(error);
      showNotification({
        type: "error",
        title: "Failed to create file",
        description: error?.message,
      });
    }
  }, []);

  const handleWrite: WHFileContextProps["write"] = React.useCallback(
    async (data) => {
      if (!whFile) {
        showNotification({
          type: "error",
          title: "Failed to save file",
          description: "No active file.",
        });
        return;
      }

      try {
        const saved = await whFile.write(data);
        setData(saved);

        showNotification({
          type: "success",
          title: "File updated",
          description: new Date().toLocaleTimeString(),
        });
        console.log(saved);
      } catch (error: any) {
        console.error(error);
        showNotification({
          type: "error",
          title: "Failed to save file",
          description: error?.message,
        });
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
