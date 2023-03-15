import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { months } from "../../utils/date.util";
import { useYear } from "../../utils/wh-file/WHFileHooks";

export const MonthsView: React.FC = () => {
  const { year } = useParams();

  const yearHandler = useYear(year!);
  const { data: yearInfo, error } = useQuery(["year-info", year], yearHandler.getInfo);

  React.useEffect(() => {
    console.log("MONTHS", yearInfo);
  }, [yearInfo]);

  return (
    <Page title={<Link to="/years" className="hover:underline" children={year} />}>
      <LoadingOverlay visible={!yearInfo} error={error} size="2xl" />

      {yearInfo && (
        <CardContainer
          columns={4}
          rows={3}
          children={months.map((month, i) => (
            <CardLink key={month} to={`${i}/days`} data-empty={!yearInfo[i]?.daysCount} children={month} />
          ))}
        />
      )}
    </Page>
  );
};
