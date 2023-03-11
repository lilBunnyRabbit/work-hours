import React from "react";
import { IWHFile, WHFile } from "./WFile";
import { WFileContext } from "./WFileContext";

export interface WHFileProviderProps {
  children: React.ReactNode;
}

export const WFileProvider: React.FC<WHFileProviderProps> = ({ children }) => {
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
    <WFileContext.Provider
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
  const context = React.useContext(WFileContext);
  if (!context) {
    throw new Error(`${useWHFile.name} must be used within ${WFileProvider.name}`);
  }

  return context;
};
