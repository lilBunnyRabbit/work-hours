import React from "react";
import { useMatches } from "react-router-dom";

export function useFirstHandleValue<TValue, THandle extends object = any>(
  key: keyof THandle,
  filter: (value: unknown) => value is TValue
) {
  const matches = useMatches();

  return React.useMemo(() => {
    for (let i = matches.length - 1; i >= 0; i--) {
      const handle = matches[i].handle as THandle | undefined;
      if (!handle) continue;
      const value = handle[key];
      if (filter(value)) return value as TValue;
    }
  }, [key, filter, matches]);
}
