import React from "react";
import { WFileContext } from "./WFileContext";
import { WFileProvider } from "./WFileProvider";

export const useWFile = () => {
  const context = React.useContext(WFileContext);
  if (!context) {
    throw new Error(`${useWFile.name} must be used within ${WFileProvider.name}`);
  }

  return context;
};
