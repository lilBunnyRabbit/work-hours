import React from "react";
import { showNotification } from "../../layouts/Toolbar";
import { WHFileHandler } from "../WHFileHandler";
import whFileService from "../services/whFile.service";

export interface WHFileContextProps {
  handler: WHFileHandler | null;
  open: () => Promise<void>;
  create: () => Promise<void>;
}

export const WHFileContext = React.createContext<WHFileContextProps | null>(null);

export interface WHFileProviderProps {
  children: React.ReactNode;
}

export const WHFileProvider: React.FC<WHFileProviderProps> = ({ children }) => {
  const [handler, setHandler] = React.useState<WHFileContextProps["handler"]>(null);

  const handleOpen: WHFileContextProps["open"] = React.useCallback(async () => {
    try {
      const handler = await whFileService.open();
      setHandler(handler);
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
      const handler = await whFileService.create();
      setHandler(handler);
    } catch (error: any) {
      console.error(error);
      showNotification({
        type: "error",
        title: "Failed to create file",
        description: error?.message,
      });
    }
  }, []);

  return <WHFileContext.Provider value={{ handler, open: handleOpen, create: handleCreate }} children={children} />;
};
