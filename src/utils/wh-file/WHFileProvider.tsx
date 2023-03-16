import React from "react";
import { showNotification } from "../../layouts/Toolbar";
import { WHFile } from "./WHFile";
import { WHFileContext, WHFileContextProps } from "./WHFileContext";

export interface WHFileProviderProps {
  children: React.ReactNode;
}

export const WHFileProvider: React.FC<WHFileProviderProps> = ({ children }) => {
  const [whFile, setWHFile] = React.useState<WHFileContextProps["whFile"]>(null);
  const [metadata, setMetadata] = React.useState<WHFileContextProps["metadata"]>(null);

  const handleOpen: WHFileContextProps["open"] = React.useCallback(async () => {
    try {
      const [whFile] = await WHFile.open();
      setWHFile(whFile);
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
      const [whFile] = await WHFile.create();
      setWHFile(whFile);
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

  return (
    <WHFileContext.Provider value={{ whFile, metadata, open: handleOpen, create: handleCreate }} children={children} />
  );
};
