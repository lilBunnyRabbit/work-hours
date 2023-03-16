import React from "react";
import { Link, useParams } from "react-router-dom";
import { PaperButton } from "../../components/buttons/PaperButton";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { generateDays, months } from "../../utils/date.util";
import { useMonthQuery } from "../../utils/wh-file/WHFileQueries";

export const DaysView: React.FC = () => {
  const { year, month } = useParams();

  const { data: monthData, error } = useMonthQuery(year!, month!);

  const days = React.useMemo(() => generateDays(Number(year), Number(month)), [month, year]);

  React.useEffect(() => {
    console.log("DAYS", monthData);
  }, [monthData]);

  return (
    <Page
      title={
        <>
          <div className="grid grid-cols-[1fr_min-content_1fr] w-full gap-6">
            <div />
            <div>
              <Link to={`/years/${year}/months`} className="hover:underline" children={months[Number(month)]} />
              &nbsp;
              <Link to="/years" className="hover:underline" children={year} />
            </div>

            <div className="flex flex-row justify-end items-center w-full text-[18px]">
              <Link to={`/print/${year}/${month}`} className="paper-button h-[46px]" children="Print" />
            </div>
          </div>
        </>
      }
    >
      <LoadingOverlay visible={!monthData} error={error} size="2xl" />

      {monthData && (
        <CardContainer
          columns={7}
          children={days.map(({ day, active }, i) => (
            <CardLink
              key={i}
              to={`${day}`}
              data-disabled={!active}
              data-empty={!(day in monthData)}
              data-full={!!monthData[day]?.report}
              children={day + 1}
            />
          ))}
        />
      )}
    </Page>
  );
};
