import React from "react";
import { Link, useParams } from "react-router-dom";
import { Page } from "../../components/Page";
import { formatDay, months } from "../../utils/date.util";
import { useWHFile } from "../../utils/wh-file/useWHFile";

export const DayView: React.FC = () => {
  const { data, createDay, hasDay } = useWHFile();
  const { day, month, year } = useParams();

  const dayData = React.useMemo(() => data?.years?.[year!]?.[month!]?.[day!], []);

  React.useEffect(() => {
    if (hasDay(day!, year!, month!)) return;
    createDay(day!, year!, month!);
  }, [day, month, year, hasDay, createDay]);

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
      {!dayData && "Loading..."}
      {dayData && JSON.stringify(dayData)}
    </Page>
  );
};
