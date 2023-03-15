import React from "react";
import { Link, useParams } from "react-router-dom";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { useAsyncQuery } from "../../hooks/useAsync";
import { months } from "../../utils/date.util";
import { useWHFile } from "../../utils/wh-file/useWHFile";

export const MonthsView: React.FC = () => {
  const { year } = useParams();
  const { getYear, getDaysCount } = useWHFile();
  const { data, error } = useAsyncQuery(() => getYear(year!), [year]);

  React.useEffect(() => {
    console.log("MONTHS", data);
  }, [data]);

  return (
    <Page title={<Link to="/years" className="hover:underline" children={year} />}>
      <LoadingOverlay visible={!data} error={error} size="2xl" />

      {data && (
        <CardContainer
          columns={4}
          rows={3}
          children={months.map((month, i) => (
            <CardLink key={month} to={`${i}/days`} data-empty={!getDaysCount(year!, i)} children={month} />
          ))}
        />
      )}
    </Page>
  );
};
