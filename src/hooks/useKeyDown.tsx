import React from "react";

export const useKeyDown = (callback: (event: KeyboardEvent) => void) => {
  React.useEffect(() => {
    window.addEventListener("keydown", callback);

    return () => {
      window.removeEventListener("keydown", callback);
    };
  }, [callback]);
};
