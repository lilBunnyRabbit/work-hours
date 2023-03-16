import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "../../components/buttons/IconButton";
import { Icon } from "../../components/icons";
import { Markdown } from "../../components/markdown/Markdown";
import { classNames } from "../../utils/class.util";
import { daysInMonth, months } from "../../utils/date.util";
import { useMonthQuery } from "../../utils/wh-file/WHFileQueries";
import "./PrintView.scss";

export const PDFView: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { year, month } = React.useMemo(
    () => ({
      year: Number.parseInt(params.year!),
      month: Number.parseInt(params.month!),
    }),
    [params]
  );
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

  React.useEffect(() => {
    document.body.classList.add("print");
    return () => {
      document.body.classList.remove("print");
    };
  }, []);

  return (
    <div className="print-view">
      <Paper type="a4">
        <h1 className="mb-8">
          Time Sheet - {months[month]} {year}
        </h1>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, i) => {
              return (
                <tr className={classNames(day.isWeekend && "weekend")} key={`tr-${i}`}>
                  <td>{day.date.toLocaleDateString()}</td>
                  <td>{day.timeIn}</td>
                  <td>{day.timeOut}</td>
                  <td>
                    {day.hours}
                    {day.hours && "h"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Paper>

      <Paper type="a4">
        <h2 className="mb-2">Days</h2>
        <div className="flex flex-col gap-4">
          {monthData &&
            Object.keys(monthData)
              .filter((day) => monthData[day as keyof typeof monthData]!.report?.notes)
              .map((day) => {
                const dayData = monthData[day as keyof typeof monthData]!;
                const dayInfo = days[day as any];

                return (
                  <div className="flex flex-col border-l-4 border-zinc-800 gap-2 bg-zinc-100">
                    <div className="flex flex-row justify-between text-lg border-b border-b-inherit px-4 py-1 bg-zinc-300">
                      <div>{dayInfo?.date.toDateString()}</div>
                      <div>{dayData.report?.hours}h</div>
                    </div>
                    <div className="px-4 py-2">
                      <Markdown theme="light" children={dayData.report?.notes || ""} />
                    </div>
                  </div>
                );
              })}
        </div>
      </Paper>

      <div className="hide-print fixed top-4 right-4">
        <IconButton onClick={() => navigate(`/years/${year}/months/${month}/days`)}>
          <Icon.Edit className="hover:text-lime-500" height={24} />
        </IconButton>
      </div>
    </div>
  );
};

interface PaperProps {
  type: "a4";
}

const Paper: React.FC<Omit<React.ComponentProps<"div">, keyof PaperProps> & PaperProps> = ({
  type,
  className,
  ...props
}) => {
  return <article className={classNames("paper", className)} {...props} />;
};
