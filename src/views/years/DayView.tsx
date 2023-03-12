import React from "react";
import { Link, useParams } from "react-router-dom";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { useAsync } from "../../hooks/useAsync";
import { formatDay, months } from "../../utils/date.util";
import { useWHFile } from "../../utils/wh-file/useWHFile";

export const DayView: React.FC = () => {
  const { day, month, year } = useParams();
  const { getDay } = useWHFile();
  const { data, error } = useAsync(async () => await getDay(day!, month!, year!));

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
      <LoadingOverlay visible={!data} error={error} size="xl" />

      {data && JSON.stringify(data)}
    </Page>
  );
};
