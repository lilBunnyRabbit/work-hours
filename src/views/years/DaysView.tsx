import React from "react";
import { useParams } from "react-router-dom";
import { Page } from "../../components/Page";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { generateDays, isCurrentDay } from "../../utils/date.util";
import { useMonth } from "../../wh-file/context/WHFileHooks";

export const DaysView: React.FC = () => {
  const { year: iYear, month: iMonth } = useParams();

  const { month } = useMonth(iYear!, iMonth!);

  const days = React.useMemo(() => generateDays(Number(iYear), Number(iMonth)), [iMonth, iYear]);

  const yearNumber = React.useMemo(() => Number.parseInt(iYear!), [iYear]);
  const monthNumber = React.useMemo(() => Number.parseInt(iMonth!), [iMonth]);
  const isToday = React.useMemo(() => isCurrentDay(), []);

  React.useEffect(() => {
    console.log("DAYS", { month });
  }, [month]);

  return (
    <Page>
      {month && (
        <CardContainer
          columns={7}
          children={days.map(({ day, active }, i) => (
            <CardLink
              key={i}
              to={`${day}`}
              data-disabled={!active}
              data-empty={!(day in month)}
              data-full={!!month[day]?.report}
              data-highlight={isToday(yearNumber, monthNumber, day)}
              children={day + 1}
            />
          ))}
        />
      )}
    </Page>
  );
};
