import React from "react";
import { isUndefined } from "../type.util";
import { INITIAL_DAY } from "./WHFile";
import { WHFileContext } from "./WHFileContext";
import { WHFileProvider } from "./WHFileProvider";
import { IWHFile, IWHFileDay, IWHFileMonth, IWHFileYear, IWHFileYears } from "./WHFileTypes";

export const useWHFile = () => {
  const context = React.useContext(WHFileContext);
  if (!context) {
    throw new Error(`${useWHFile.name} must be used within ${WHFileProvider.name}`);
  }

  const updateData = React.useCallback(
    async (callback: (data: IWHFile) => void): Promise<IWHFile> => {
      const clone = structuredClone(context.data!) as IWHFile;
      await Promise.resolve(callback(clone));
      await context.write(clone);

      return clone;
    },
    [context]
  );

  const getYears = React.useCallback((): IWHFileYears => {
    if (context.data?.years) return context.data.years;
    return {};
  }, [context]);

  const getYear = React.useCallback(
    (year: number | string): IWHFileYear => {
      const years = getYears();
      if (years[year]) return years[year]!;
      return {};
    },
    [context, getYears]
  );

  const getMonth = React.useCallback(
    (month: number | string, year: number | string): IWHFileMonth => {
      const yearData = getYear(year);
      if (yearData[month]) return yearData[month]!;
      return {};
    },
    [context, getYear]
  );

  const getDay = React.useCallback(
    async (day: number | string, month: number | string, year: number | string): Promise<IWHFileDay> => {
      const monthData = getMonth(month, year);
      if (monthData[day]) return monthData[day]!;

      const clone = await updateData((data) => {
        if (!data.years) data.years = {};
        if (!data.years![year]) data.years[year] = {};
        if (!data.years![year]![month]) data.years[year]![month] = {};
        data.years![year]![month]![day] = INITIAL_DAY;
      });

      return clone.years![year]![month]![day]!;
    },
    [context, getMonth, updateData]
  );

  const getDays = React.useCallback((year: number | string, month?: number | string): IWHFileDay[] => {
    const yearData = getYears()[year];

    if (!yearData || Object.keys(yearData).length === 0) return [];

    if (!isUndefined(month)) {
      const monthData = yearData[month] || {};
      const keys = Object.keys(yearData[month] || {});
      return keys.map((day) => monthData[day as keyof typeof monthData]) as IWHFileDay[];
    }

    return Object.keys(yearData).reduce((days: IWHFileDay[], month) => {
      const monthData = yearData[month] || {};
      for (const day in monthData) {
        days.push(monthData[day as keyof typeof monthData]!);
      }
      return days;
    }, []);
  }, [getYears]);

  const getDaysCount = React.useCallback(
    (year: number | string, month?: number | string): number => {
      const yearData = getYears()[year];

      if (!yearData || Object.keys(yearData).length === 0) return 0;

      if (!isUndefined(month)) {
        return Object.keys(yearData[month] || {}).length;
      }

      return Object.keys(yearData).reduce((count, month) => {
        return count + Object.keys(yearData[month] || {}).length;
      }, 0);
    },
    [getYears]
  );

  return {
    ...context,
    getYears,
    getYear,
    getMonth,
    getDay,

    getDays,
    getDaysCount,
    updateData,
  };
};
