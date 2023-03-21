import React from "react";
import { isFunction, isString } from "../utils/type.util";
import { WHFile } from "./types/WHFileTypes";
import { useWHFile } from "./useWHFile";

interface YearInfo {
  daysCount: number;
}

export const useYears = () => {
  const context = useWHFile();
  if (!context.handler) {
    throw new Error('No open "Work Hours File".');
  }

  const handleGet = React.useCallback(async (): Promise<WHFile.Years> => {
    const data = await context.handler!.getData();
    return data.years || {};
  }, [context]);

  const handleGetInfo = React.useCallback(async (): Promise<Record<string, YearInfo>> => {
    const years = await handleGet();

    return Object.keys(years).reduce((info: Record<string, YearInfo>, yearKey) => {
      const yearData = years[yearKey]!;

      info[yearKey] = {
        daysCount: Object.keys(yearData).reduce((count, monthKey) => {
          return count + Object.keys(yearData[monthKey] || {}).length;
        }, 0),
      };

      return info;
    }, {});
  }, [handleGet]);

  return {
    get: handleGet,
    getInfo: handleGetInfo,
  };
};

interface MonthInfo {
  daysCount: number;
}

export const useYear = (iYear: string | number) => {
  const context = useWHFile();
  if (!context.handler) {
    throw new Error('No open "Work Hours File".');
  }

  const { year } = React.useMemo(() => {
    return {
      year: isString(iYear) ? Number.parseInt(iYear) : iYear,
    };
  }, [iYear]);

  const handleGet = React.useCallback(async (): Promise<WHFile.Year> => {
    const data = await context.handler!.getData();
    return data.years?.[year] || {};
  }, [context, year]);

  const handleGetInfo = React.useCallback(async (): Promise<Record<string, MonthInfo>> => {
    const year = await handleGet();

    return Object.keys(year).reduce((info: Record<string, MonthInfo>, monthKey) => {
      const monthData = year[monthKey]!;

      info[monthKey] = {
        daysCount: Object.keys(monthData).length,
      };

      return info;
    }, {});
  }, [handleGet]);

  return {
    get: handleGet,
    getInfo: handleGetInfo,
  };
};

export const useMonth = (iYear: string | number, iMonth: string | number) => {
  const context = useWHFile();
  if (!context.handler) {
    throw new Error('No open "Work Hours File".');
  }

  const { year, month } = React.useMemo(() => {
    return {
      year: isString(iYear) ? Number.parseInt(iYear) : iYear,
      month: isString(iMonth) ? Number.parseInt(iMonth) : iMonth,
    };
  }, [iYear, iMonth]);

  const handleGet = React.useCallback(async (): Promise<WHFile.Month> => {
    const data = await context.handler!.getData();
    return data.years?.[year]?.[month] || {};
  }, [context, year, month]);

  return {
    get: handleGet,
  };
};

export interface UpdateDayFunction {
  (day: WHFile.Day): Promise<WHFile.Day>;
  (callback: (day: WHFile.Day) => Promise<WHFile.Day> | WHFile.Day): Promise<WHFile.Day>;
}

export const useDay = (iYear: string | number, iMonth: string | number, iDay: string | number) => {
  const context = useWHFile();
  if (!context.handler) {
    throw new Error('No open "Work Hours File".');
  }

  const { year, month, day } = React.useMemo(() => {
    return {
      year: isString(iYear) ? Number.parseInt(iYear) : iYear,
      month: isString(iMonth) ? Number.parseInt(iMonth) : iMonth,
      day: isString(iDay) ? Number.parseInt(iDay) : iDay,
    };
  }, [iYear, iMonth, iDay]);

  const handleRemove = React.useCallback(async (): Promise<WHFile.default> => {
    const data = await context.handler!.getData();
    if (data?.years?.[year]?.[month]?.[day]) {
      delete data.years![year]![month]![day];
      return await context.handler!.write(data);
    }

    return data;
  }, [context, year, month, day]);

  const handleUpdate: UpdateDayFunction = React.useCallback(
    async (arg) => {
      const data = await context.handler!.getData();
      if (!data.years) data.years = {};
      if (!data.years[year]) data.years[year] = {};
      if (!data.years[year]![month]) data.years[year]![month] = {};

      let currentDay = data.years[year]![month]![day] || WHFile.INITIAL_DAY;
      let newDay: WHFile.Day;

      if (isFunction(arg)) newDay = await Promise.resolve(arg(currentDay));
      else newDay = arg;

      data.years[year]![month]![day] = newDay;

      const newData = await context.handler!.write(data);
      return newData?.years?.[year]?.[month]?.[day] || WHFile.INITIAL_DAY;
    },
    [context, year, month, day]
  );

  const handleGet = React.useCallback(async (): Promise<WHFile.Day> => {
    const data = await context.handler!.getData();
    const currentDay = data?.years?.[year]?.[month]?.[day];
    if (!currentDay) {
      return await handleUpdate((day) => day);
    }
    return currentDay;
  }, [context, year, month, day, handleUpdate]);

  return {
    get: handleGet,
    remove: handleRemove,
    update: handleUpdate,
  };
};
