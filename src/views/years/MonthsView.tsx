import React from "react";
import { useParams } from "react-router-dom";
import { Page } from "../../components/Page";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { isCurrentMonth, months } from "../../utils/date.util";
import { useYear } from "../../wh-file/context/WHFileHooks";

export const MonthsView: React.FC = () => {
  const { year: iYear } = useParams();

  const { year, info } = useYear(iYear!);

  const yearNumber = React.useMemo(() => Number.parseInt(iYear!), [iYear]);
  const isToday = React.useMemo(() => isCurrentMonth(), []);

  React.useEffect(() => {
    console.log("MONTHS", { year, info });
  }, [year, info]);

  return (
    <Page>
      {info && (
        <CardContainer
          columns={4}
          children={months.map((month, i) => (
            <CardLink
              key={month}
              to={`${i}/days`}
              data-empty={!info[i]?.daysCount}
              data-highlight={isToday(yearNumber, i)}
              children={month}
            />
          ))}
        />
      )}
    </Page>
  );
};
