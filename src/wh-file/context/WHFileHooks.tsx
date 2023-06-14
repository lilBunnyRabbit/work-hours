import React from "react";
import { WHFileContext, WHFileProvider } from "./WHFileContext";
import { WHFile } from "../WHFile";
import { isString } from "../../utils/type.util";

export const useWHFile = () => {
  const context = React.useContext(WHFileContext);
  if (!context) {
    throw new Error(`${useWHFile.name} must be used within ${WHFileProvider.name}`);
  }

  return context;
};

interface YearInfo {
  daysCount: number;
}

export const useYears = () => {
  const context = useWHFile();
  if (!context.manager) {
    throw new Error('No open "Work Hours File".');
  }

  const [years, setYears] = React.useState(() => context.manager!.handler.data.years || {});

  React.useEffect(() => {
    setYears(context.manager!.handler.data.years || {});
  }, [context]);

  const info = React.useMemo(() => {
    return Object.keys(years).reduce((info: Record<string, YearInfo>, yearKey) => {
      const yearData = years[yearKey]!;

      info[yearKey] = {
        daysCount: Object.keys(yearData).reduce((count, monthKey) => {
          return count + Object.keys(yearData[monthKey as keyof typeof yearData] || {}).length;
        }, 0),
      };

      return info;
    }, {});
  }, [years]);

  return { years, info };
};

interface MonthInfo {
  daysCount: number;
}

export const useYear = (iYear: string | number) => {
  const context = useWHFile();
  if (!context.manager) {
    throw new Error('No open "Work Hours File".');
  }

  const keys = React.useMemo(() => {
    return {
      year: isString(iYear) ? Number.parseInt(iYear) : iYear,
    };
  }, [iYear]);

  const [year, setYear] = React.useState(() => context.manager!.handler.data.years?.[keys.year] || {});

  React.useEffect(() => {
    setYear(context.manager!.handler.data.years?.[keys.year] || {});
  }, [context, keys]);

  const info = React.useMemo(() => {
    return Object.keys(year).reduce((info: Record<string, MonthInfo>, monthKey) => {
      const monthData = year[monthKey]!;

      info[monthKey] = {
        daysCount: Object.keys(monthData).length,
      };

      return info;
    }, {});
  }, [year]);

  return { keys, year, info };
};

export const useMonth = (iYear: string | number, iMonth: string | number) => {
  const context = useWHFile();
  if (!context.manager) {
    throw new Error('No open "Work Hours File".');
  }

  const keys = React.useMemo(() => {
    return {
      year: isString(iYear) ? Number.parseInt(iYear) : iYear,
      month: isString(iMonth) ? Number.parseInt(iMonth) : iMonth,
    };
  }, [iYear, iMonth]);

  const [month, setMonth] = React.useState(() => context.manager!.handler.data.years?.[keys.year]?.[keys.month] || {});

  React.useEffect(() => {
    setMonth(context.manager!.handler.data.years?.[keys.year]?.[keys.month] || {});
  }, [context, keys]);

  return { keys, month };
};

export interface UpdateDayFunction {
  (day: WHFile.Day): Promise<WHFile.Day>;
  (callback: (day: WHFile.Day) => Promise<WHFile.Day> | WHFile.Day): Promise<WHFile.Day>;
}

export const useDay = (iYear: string | number, iMonth: string | number, iDay: string | number) => {
  const context = useWHFile();
  if (!context.manager) {
    throw new Error('No open "Work Hours File".');
  }

  const keys = React.useMemo(() => {
    return {
      year: isString(iYear) ? Number.parseInt(iYear) : iYear,
      month: isString(iMonth) ? Number.parseInt(iMonth) : iMonth,
      day: isString(iDay) ? Number.parseInt(iDay) : iDay,
    };
  }, [iYear, iMonth, iDay]);

  const [day, setDay] = React.useState(
    () => context.manager!.handler.data.years?.[keys.year]?.[keys.month]?.[keys.day]
  );

  React.useEffect(() => {
    setDay(context.manager!.handler.data.years?.[keys.year]?.[keys.month]?.[keys.day]);
  }, [context, keys]);

  const handleDelete = React.useCallback(async () => {
    const data = {...context.manager?.handler.data};
    if (data?.years?.[keys.year]?.[keys.month]?.[keys.day]) {
      delete data.years![keys.year]![keys.month]![keys.day];
      return await context.manager!.update(data as WHFile.default);
    }

    return data;
  }, [context, keys]);

  // const handleUpdate: UpdateDayFunction = React.useCallback(
  //   async (arg) => {
  //     const data = await context.handler!.getData();
  //     if (!data.years) data.years = {};
  //     if (!data.years[year]) data.years[year] = {};
  //     if (!data.years[year]![month]) data.years[year]![month] = {};

  //     let currentDay = data.years[year]![month]![day] || WHFile.INITIAL_DAY;
  //     let newDay: WHFile.Day;

  //     if (isFunction(arg)) newDay = await Promise.resolve(arg(currentDay));
  //     else newDay = arg;

  //     data.years[year]![month]![day] = newDay;

  //     const newData = await context.handler!.write(data);
  //     return newData?.years?.[year]?.[month]?.[day] || WHFile.INITIAL_DAY;
  //   },
  //   [context, year, month, day]
  // );

  // const handleGet = React.useCallback(async (): Promise<WHFile.Day> => {
  //   const data = await context.handler!.getData();
  //   const currentDay = data?.years?.[year]?.[month]?.[day];
  //   if (!currentDay) {
  //     return await handleUpdate((day) => day);
  //   }
  //   return currentDay;
  // }, [context, year, month, day, handleUpdate]);

  return { keys, day, delete: handleDelete };
};
