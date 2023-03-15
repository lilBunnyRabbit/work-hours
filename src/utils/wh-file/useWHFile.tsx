import React from "react";
import { WHFileContext } from "./WHFileContext";
import { WHFileProvider } from "./WHFileProvider";

export const useWHFile = () => {
  const context = React.useContext(WHFileContext);
  if (!context) {
    throw new Error(`${useWHFile.name} must be used within ${WHFileProvider.name}`);
  }

  return context;
};
