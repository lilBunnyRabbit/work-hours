import React from "react";
import { isFunction, isString } from "../type.util";
import { useWHFile } from "./useWHFile";
import { INITIAL_DAY } from "./WHFile";
import { IWHFile, IWHFileDay, IWHFileMonth, IWHFileYear, IWHFileYears } from "./WHFileTypes";

interface YearInfo {
  daysCount: number;
}

export const useYears = () => {
  const context = useWHFile();
  if (!context.whFile) {
    throw new Error('No open "Work Hours File".');
  }

  const handleGet = React.useCallback(async (): Promise<IWHFileYears> => {
    const data = await context.whFile!.getData();
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
  if (!context.whFile) {
    throw new Error('No open "Work Hours File".');
  }

  const { year } = React.useMemo(() => {
    return {
      year: isString(iYear) ? Number.parseInt(iYear) : iYear,
    };
  }, [iYear]);

  const handleGet = React.useCallback(async (): Promise<IWHFileYear> => {
    const data = await context.whFile!.getData();
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
  if (!context.whFile) {
    throw new Error('No open "Work Hours File".');
  }

  const { year, month } = React.useMemo(() => {
    return {
      year: isString(iYear) ? Number.parseInt(iYear) : iYear,
      month: isString(iMonth) ? Number.parseInt(iMonth) : iMonth,
    };
  }, [iYear, iMonth]);

  const handleGet = React.useCallback(async (): Promise<IWHFileMonth> => {
    const data = await context.whFile!.getData();
    return data.years?.[year]?.[month] || {};
  }, [context, year, month]);

  return {
    get: handleGet,
  };
};

export interface UpdateDayFunction {
  (day: IWHFileDay): Promise<IWHFileDay>;
  (callback: (day: IWHFileDay) => Promise<IWHFileDay> | IWHFileDay): Promise<IWHFileDay>;
}

export const useDay = (iYear: string | number, iMonth: string | number, iDay: string | number) => {
  const context = useWHFile();
  if (!context.whFile) {
    throw new Error('No open "Work Hours File".');
  }

  const { year, month, day } = React.useMemo(() => {
    return {
      year: isString(iYear) ? Number.parseInt(iYear) : iYear,
      month: isString(iMonth) ? Number.parseInt(iMonth) : iMonth,
      day: isString(iDay) ? Number.parseInt(iDay) : iDay,
    };
  }, [iYear, iMonth, iDay]);

  const handleRemove = React.useCallback(async (): Promise<IWHFile> => {
    const data = await context.whFile!.getData();
    if (data?.years?.[year]?.[month]?.[day]) {
      delete data.years![year]![month]![day];
      return await context.whFile!.write(data);
    }

    return data;
  }, [context, year, month, day]);

  const handleUpdate: UpdateDayFunction = React.useCallback(
    async (arg) => {
      const data = await context.whFile!.getData();
      if (!data.years) data.years = {};
      if (!data.years[year]) data.years[year] = {};
      if (!data.years[year]![month]) data.years[year]![month] = {};

      let currentDay = data.years[year]![month]![day] || INITIAL_DAY;
      let newDay: IWHFileDay;

      if (isFunction(arg)) newDay = await Promise.resolve(arg(currentDay));
      else newDay = arg;

      data.years[year]![month]![day] = newDay;

      const newData = await context.whFile!.write(data);
      return newData?.years?.[year]?.[month]?.[day] || INITIAL_DAY;
    },
    [context, year, month, day]
  );

  const handleGet = React.useCallback(async (): Promise<IWHFileDay> => {
    const data = await context.whFile!.getData();
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
