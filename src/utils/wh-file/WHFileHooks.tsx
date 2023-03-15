import React from "react";
import { isFunction, isString } from "../type.util";
import { INITIAL_DAY } from "./WHFile";
import { WHFileContext } from "./WHFileContext";
import { WHFileProvider } from "./WHFileProvider";
import { IWHFile, IWHFileDay } from "./WHFileTypes";

export interface UpadteDayFunction {
  (day: IWHFileDay): Promise<IWHFileDay>;
  (callback: (day: IWHFileDay) => Promise<IWHFileDay> | IWHFileDay): Promise<IWHFileDay>;
}

export const useDay = (iYear: string | number, iMonth: string | number, iDay: string | number) => {
  const context = React.useContext(WHFileContext);
  if (!context) {
    throw new Error(`${useDay.name} must be used within ${WHFileProvider.name}`);
  }

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

  const handleUpdate: UpadteDayFunction = React.useCallback(
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
