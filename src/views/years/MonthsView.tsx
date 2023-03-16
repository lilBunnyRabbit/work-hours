import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
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
    <Page>
      <LoadingOverlay visible={!yearInfo} error={error} size="2xl" />

      {yearInfo && (
        <CardContainer
          columns={4}
          children={months.map((month, i) => (
            <CardLink key={month} to={`${i}/days`} data-empty={!yearInfo[i]?.daysCount} children={month} />
          ))}
        />
      )}
    </Page>
  );
};
