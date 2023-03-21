import { parseTime } from "../utils/date.util";
import { WHFile } from "./types/WHFileTypes";

export const totalWorkLogTime = (workLogs: WHFile.Day["workLogs"]) => {
  const ms = workLogs.reduce((total, workLog) => {
    if (!workLog.to) return total;
    const difference = new Date(workLog.to).getTime() - new Date(workLog.from).getTime();
    return total + (difference > 0 ? difference : 0);
  }, 0);
  return parseTime(ms);
};
