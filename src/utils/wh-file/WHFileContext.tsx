import React from "react";
import { IWHFile, WHFile } from "./WHFile";

export interface WHFileContextProps {
  whFile: WHFile | null;
  data?: IWHFile | null;
  open: () => Promise<void>;
  create: () => Promise<void>;
}

export const WHFileContext = React.createContext<WHFileContextProps | null>(null);
