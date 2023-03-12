import React from "react";
import { WHFileContext } from "./WHFileContext";
import { WHFileProvider } from "./WHFileProvider";

export const useWHFile = () => {
  const context = React.useContext(WHFileContext);
  if (!context) {
    throw new Error(`${useWHFile.name} must be used within ${WHFileProvider.name}`);
  }

  const hasYear = React.useCallback(
    (year: number | string) => {
      if (!context.data?.years) return false;
      return year in context.data.years;
    },
    [context]
  );

  const hasMonth = React.useCallback(
    (month: number | string, year: number | string) => {
      if (!hasYear(year)) return false;
      return month in context.data!.years![year]!;
    },
    [context, hasYear]
  );

  const hasDay = React.useCallback(
    (day: number | string, month: number | string, year: number | string) => {
      if (!hasMonth(month, year)) return false;
      return day in context.data!.years![year]![month]!;
    },
    [context, hasMonth]
  );

  const createDay = React.useCallback(
    async (day: number | string, month: number | string, year: number | string) => {
      if (!hasMonth(month, year) || hasDay(day, month, year)) return;
      const clone = structuredClone(context.data!) as NonNullable<typeof context.data>;
      clone.years![year]![month]![day] = {
        workLog: [],
        tasks: [],
        notes: [],
      };

      await context.write(clone);
    },
    [context, hasDay]
  );

  return {
    ...context,
    hasYear,
    hasMonth,
    hasDay,
    createDay,
  };
};
