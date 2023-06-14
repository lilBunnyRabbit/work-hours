import React from "react";
import { showNotification } from "../layouts/Toolbar";
import { WHFileHandler } from "./WHFileHandler";
import { WHFileContext, WHFileContextProps } from "./WHFileContext";

export interface WHFileProviderProps {
  children: React.ReactNode;
}

export const WHFileProvider: React.FC<WHFileProviderProps> = ({ children }) => {
  const [whFile, setWHFile] = React.useState<WHFileContextProps["handler"]>(null);
  const [metadata, setMetadata] = React.useState<WHFileContextProps["metadata"]>(null);

  const handleOpen: WHFileContextProps["open"] = React.useCallback(async () => {
    try {
      const [whFile] = await WHFileHandler.open();
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
      const [whFile] = await WHFileHandler.create();
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
    <WHFileContext.Provider value={{ handler: whFile, metadata, open: handleOpen, create: handleCreate }} children={children} />
  );
};
