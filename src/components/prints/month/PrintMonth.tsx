import React from "react";
import { classNames } from "../../../utils/class.util";
import { daysInMonth, formatDate, formatHours, months } from "../../../utils/date.util";
import { useMonthQuery } from "../../../utils/wh-file/WHFileQueries";
import { Markdown } from "../../markdown/Markdown";
import { Print } from "../Print";
import "./PrintMonth.scss";

interface PrintMonthProps {
  year: number;
  month: number;
}

export const PrintMonth: React.FC<PrintMonthProps> = ({ year, month }) => {
  const daysCount = React.useMemo(() => daysInMonth(year, month), [year, month]);

  const { data: monthData } = useMonthQuery(year!, month!);

  const days = React.useMemo(() => {
    return Array(daysCount)
      .fill(0)
      .map((_, day) => {
        const date = new Date(year!, month, day + 1);
        const isWeekend = [0, 6].includes(date.getDay());

        const dayData = monthData?.[day];
        console.log({ monthData });

        let minFrom: number | undefined = undefined;
        let maxTo: number | undefined = undefined;

        dayData?.workLogs.map((workLog) => {
          const fromTime = new Date(workLog.from).getTime();
          if (!minFrom || fromTime < minFrom) minFrom = fromTime;

          if (workLog.to) {
            const toTime = new Date(workLog.to).getTime();
            if (!maxTo || toTime > maxTo) maxTo = toTime;
          }
        });

        return {
          date: date,
          isWeekend,
          timeIn: minFrom ? new Date(minFrom).toLocaleTimeString() : undefined,
          timeOut: maxTo ? new Date(maxTo).toLocaleTimeString() : undefined,
          hours: dayData?.report?.hours,
        };
      });
  }, [daysCount, monthData]);

  const totalHours = React.useMemo(
    () =>
      Object.keys(monthData || {})
        .reduce((total, current) => {
          return total + (monthData?.[current as keyof typeof monthData]?.report?.hours || 0);
        }, 0),
    []
  );

  return (
    <Print.Document className="print-month">
      <Print.Page>
        <h2 className="bg-zinc-700 text-zinc-100 text-[28px] py-4 px-8">
          Time Sheet - {months[month]} {year}
        </h2>

        <h3 className="flex justify-between gap-4 mx-8 my-8">
          <span>Total Hours:</span>
          <span>{formatHours(totalHours)}</span>
        </h3>

        <table>
          <colgroup>
            <col span={1} />
            <col span={1} style={{ width: "33%" }} />
            <col span={1} style={{ width: "33%" }} />
            <col span={1} style={{ width: "33%" }} />
          </colgroup>

          <thead>
            <tr>
              <th>Date</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, i) => {
              return (
                <tr className={classNames(day.isWeekend && "weekend")} key={`tr-${i}`}>
                  <td>{formatDate(day.date)}</td>
                  <td>{day.timeIn}</td>
                  <td>{day.timeOut}</td>
                  <td>{formatHours(day.hours)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Print.Page>

      <Print.Page dynamic>
        <h2 className="bg-zinc-700 text-[28px] text-zinc-100 py-4 px-8">Notes</h2>

        <h3 className="flex justify-between gap-4 mx-8 my-8">
          <span>Total Notes:</span>
          <span>{Object.keys(monthData || {}).length}</span>
        </h3>

        <div className="flex flex-col">
          {monthData &&
            Object.keys(monthData)
              .filter((day) => monthData[day as keyof typeof monthData]!.report?.notes)
              .map((day) => {
                const dayData = monthData[day as keyof typeof monthData]!;
                const dayInfo = days[day as any];

                return (
                  <div className="flex flex-col bg-zinc-100">
                    <div className="flex flex-row justify-between border-y border-y-zinc-700 px-8 py-2 bg-zinc-700 text-zinc-100">
                      <div>{formatDate(dayInfo.date)}</div>
                      <div>{formatHours(dayData.report?.hours)}</div>
                    </div>
                    <div className="px-8 py-4">
                      <Markdown print theme="light" children={dayData.report?.notes || ""} />
                    </div>
                  </div>
                );
              })}
        </div>
      </Print.Page>
    </Print.Document>
  );
};
