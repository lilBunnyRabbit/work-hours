import React from "react";
import { Link, useParams } from "react-router-dom";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { useAsync } from "../../hooks/useAsync";
import { generateDays, months } from "../../utils/date.util";
import { useWHFile } from "../../utils/wh-file/useWHFile";

export const DaysView: React.FC = () => {
  const { month, year } = useParams();
  const { getMonth } = useWHFile();
  const { data, error } = useAsync(() => getMonth(month!, year!));

  const days = React.useMemo(() => generateDays(Number(year), Number(month)), [month, year]);

  React.useEffect(() => {
    console.log("DAYS", data);
  }, [data]);

  return (
    <Page
      title={
        <>
          <Link to={`/years/${year}/months`} className="hover:underline" children={months[Number(month)]} />
          &nbsp;
          <Link to="/years" className="hover:underline" children={year} />
        </>
      }
    >
      <LoadingOverlay visible={!data} error={error} size="2xl" />

      {data && (
        <CardContainer
          columns={7}
          rows={6}
          children={days.map(({ day, active }, i) => (
            <CardLink key={i} to={`${day}`} data-disabled={!active} data-empty={!(day in data)} children={day + 1} />
          ))}
        />
      )}
    </Page>
  );
};
