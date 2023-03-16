import React from "react";
import { useParams } from "react-router-dom";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { generateDays } from "../../utils/date.util";
import { useMonthQuery } from "../../utils/wh-file/WHFileQueries";

export const DaysView: React.FC = () => {
  const { year, month } = useParams();

  const { data: monthData, error } = useMonthQuery(year!, month!);

  const days = React.useMemo(() => generateDays(Number(year), Number(month)), [month, year]);

  React.useEffect(() => {
    console.log("DAYS", monthData);
  }, [monthData]);

  return (
    <Page>
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
