import React from "react";
import { WHFileMetadata } from "./types/WHFileTypes";
import { WHFileHandler } from "./WHFileHandler";

export interface WHFileContextProps {
  handler: WHFileHandler | null;
  metadata: WHFileMetadata | null;
  open: () => Promise<void>;
  create: () => Promise<void>;
}

export const WHFileContext = React.createContext<WHFileContextProps | null>(null);
