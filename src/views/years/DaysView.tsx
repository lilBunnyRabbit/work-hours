import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { generateDays, months } from "../../utils/date.util";
import { useMonth } from "../../utils/wh-file/WHFileHooks";

export const DaysView: React.FC = () => {
  const { year, month } = useParams();

  const monthHanler = useMonth(year!, month!);
  const { data: monthData, error } = useQuery(["month", year, month], monthHanler.get);

  const days = React.useMemo(() => generateDays(Number(year), Number(month)), [month, year]);

  React.useEffect(() => {
    console.log("DAYS", monthData);
  }, [monthData]);

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
      <LoadingOverlay visible={!monthData} error={error} size="2xl" />

      {monthData && (
        <CardContainer
          columns={7}
          rows={6}
          children={days.map(({ day, active }, i) => (
            <CardLink
              key={i}
              to={`${day}`}
              data-disabled={!active}
              data-empty={!(day in monthData)}
              children={day + 1}
            />
          ))}
        />
      )}
    </Page>
  );
};
