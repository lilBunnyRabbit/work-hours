import { useQuery } from "@tanstack/react-query";
import { useDay } from "./WHFileHooks";

export const useDayQuery = (iYear: string | number, iMonth: string | number, iDay: string | number) => {
  const handler = useDay(iYear, iMonth, iDay);
  return {
    ...useQuery(["day", iYear, iMonth, iDay], handler.get),
    handler,
  };
};
