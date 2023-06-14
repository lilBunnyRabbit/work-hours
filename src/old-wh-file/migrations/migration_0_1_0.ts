import * as WHFile_0_0_0 from "../types/versions/WHFile_0_0_0";
import * as WHFile_0_1_0 from "../types/versions/WHFile_0_1_0";

function forYears(
  years: WHFile_0_0_0.Years,
  callback: (year: WHFile_0_0_0.Year, key: keyof WHFile_0_0_0.Years) => void
) {
  for (const key in years) {
    if (Object.prototype.hasOwnProperty.call(years, key)) {
      callback(years[key]!, key);
    }
  }
}

function forYear(year: WHFile_0_0_0.Year, callback: (month: WHFile_0_0_0.Month, key: keyof WHFile_0_0_0.Year) => void) {
  for (const key in year) {
    if (Object.prototype.hasOwnProperty.call(year, key)) {
      callback(year[key]!, key);
    }
  }
}

function forMonth(month: WHFile_0_0_0.Month, callback: (day: WHFile_0_0_0.Day, key: keyof WHFile_0_0_0.Month) => void) {
  for (const key in month) {
    if (Object.prototype.hasOwnProperty.call(month, key)) {
      callback(month[key]!, key);
    }
  }
}

function forDays(
  years: WHFile_0_0_0.Years,
  callback: (
    day: WHFile_0_0_0.Day,
    keys: {
      year: keyof WHFile_0_0_0.Years;
      month: keyof WHFile_0_0_0.Year;
      day: keyof WHFile_0_0_0.Month;
    }
  ) => void
) {
  forYears(years, (year, yearKey) => {
    forYear(year, (month, monthKey) => {
      forMonth(month, (day, dayKey) => {
        callback(day, { year: yearKey, month: monthKey, day: dayKey });
      });
    });
  });
}

export const dateToTimeValue = (date: Date): WHFile_0_1_0.Day["workLogs"][number]["from"] => {
  const padNumber = (value: number) => `${String(value).padStart(2, "0")}` as `${number}` | `0${number}`;
  return `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(date.getSeconds())}`;
};

export default function migration_0_1_0(data: WHFile_0_0_0.default): WHFile_0_1_0.default {
  const years: WHFile_0_1_0.Years = {};

  if (data.years) {
    forDays(data.years, (day, keys) => {
      if (!years[keys.year]) years[keys.year] = {};
      if (!years[keys.year]![keys.month]) years[keys.year]![keys.month] = {};

      years[keys.year]![keys.month]![keys.day] = {
        ...day,
        workLogs: day.workLogs.map((workLog) => ({
          ...workLog,
          from: dateToTimeValue(new Date(workLog.from)),
          to: workLog.to ? dateToTimeValue(new Date(workLog.to)) : undefined,
        })),
      };
    });
  }

  return {
    __version: WHFile_0_1_0.VERSION,
    __lastUpdated: Date.now(),
    ...WHFile_0_1_0.INITIAL_DATA,
    years,
  };
}
