import React from "react";
import { IWHFile, WHFile } from "./WFile";

export interface WFileContextProps {
  whFile: WHFile | null;
  data?: IWHFile | null;
  open: () => Promise<void>;
  create: () => Promise<void>;
}

export const WFileContext = React.createContext<WFileContextProps | null>(null);
