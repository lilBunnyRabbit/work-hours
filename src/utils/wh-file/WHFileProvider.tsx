import React from "react";
import { IWHFile, WHFile } from "./WHFile";
import { WHFileContext } from "./WHFileContext";

export interface WHFileProviderProps {
  children: React.ReactNode;
}

export const WHFileProvider: React.FC<WHFileProviderProps> = ({ children }) => {
  const [whFile, setWHFile] = React.useState<WHFile | null>(null);
  const [data, setData] = React.useState<IWHFile | null>(null);

  const handleOpen = React.useCallback(async () => {
    try {
      const [whFile, data] = await WHFile.open();
      setWHFile(whFile);
      setData(data);
    } catch (error) {
      console.error(error);
      // TODO: Notification
    }
  }, []);

  const handleCreate = React.useCallback(async () => {
    try {
      const [whFile, data] = await WHFile.create();
      setWHFile(whFile);
      setData(data);
    } catch (error) {
      console.error(error);
      // TODO: Notification
    }
  }, []);

  console.log(data);

  return (
    <WHFileContext.Provider
      value={{
        whFile,
        data,
        open: handleOpen,
        create: handleCreate,
      }}
      children={children}
    />
  );
};

export const useWHFile = () => {
  const context = React.useContext(WHFileContext);
  if (!context) {
    throw new Error(`${useWHFile.name} must be used within ${WHFileProvider.name}`);
  }

  return context;
};
