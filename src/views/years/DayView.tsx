import React from "react";
import { Link, useParams } from "react-router-dom";
import { LogInput } from "../../components/inputs/log/LogInput";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { useAsync } from "../../hooks/useAsync";
import { useStopWatch } from "../../hooks/useStopwatch";
import { formatDay, months } from "../../utils/date.util";
import { useWHFile } from "../../utils/wh-file/useWHFile";

export const DayView: React.FC = () => {
  const { day, month, year } = useParams();
  const { getDay } = useWHFile();
  const { data, error } = useAsync(async () => await getDay(day!, month!, year!));
  // const { time } = useStopWatch(new Date("2023-03-12T03:24:00").getTime());
  const { time } = useStopWatch();

  React.useEffect(() => {
    console.log("DAY", data);
  }, [data]);

  return (
    <Page
      title={
        <>
          <Link to={`/years/${year}/months`} className="hover:underline" children={months[Number(month)]} />
          &nbsp;
          <Link
            to={`/years/${year}/months/${month}/days`}
            className="hover:underline"
            children={formatDay(Number(day) + 1)}
          />
          &nbsp;
          <Link to="/years" className="hover:underline" children={year} />
        </>
      }
    >
      <LoadingOverlay visible={!data} error={error} size="2xl" />

      {data && (
        <div className="flex flex-row w-full h-full flex-wrap justify-evenly" style={{ border: "1px solid red" }}>
          <div className="flex-1">
            <LogInput />
          </div>
          <div className="flex-1">
            <span>{`${time.hours}:${time.minutes}:${time.seconds}:${time.milliseconds}`}</span>
            &nbsp;
            <span>{`${time.hours}h ${time.minutes}min ${time.seconds}s`}</span>
          </div>
        </div>
      )}
    </Page>
  );
};
