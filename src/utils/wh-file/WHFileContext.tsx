import React from "react";
import { WHFile } from "./WHFile";
import { IWHFile, IWHFileMetadata } from "./WHFileTypes";

export interface WHFileContextProps {
  whFile: WHFile | null;
  metadata: IWHFileMetadata | null;
  open: () => Promise<void>;
  create: () => Promise<void>;
}

export const WHFileContext = React.createContext<WHFileContextProps | null>(null);
