import { useQuery } from "@tanstack/react-query";
import { useDay, useMonth, useYears } from "./WHFileHooks";

export const useYearsInfoQuery = () => {
  const handler = useYears();
  return useQuery(["years-info"], handler.getInfo);
};

export const useMonthQuery = (iYear: string | number, iMonth: string | number) => {
  const handler = useMonth(iYear, iMonth);
  return useQuery(["month", iYear, iMonth], handler.get);
};

export const useDayQuery = (iYear: string | number, iMonth: string | number, iDay: string | number) => {
  const handler = useDay(iYear, iMonth, iDay);
  return {
    ...useQuery(["day", iYear, iMonth, iDay], handler.get),
    handler,
  };
};
