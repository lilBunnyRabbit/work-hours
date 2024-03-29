import React from "react";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { useKeyDown } from "../../hooks/useKeyDown";
import { useYearsInfoQuery } from "../../wh-file/WHFileQueries";
import { isCurrentYear } from "../../utils/date.util";

export const YearsView: React.FC = () => {
  const { data: yearsInfo, error } = useYearsInfoQuery();

  const [year, setYear] = React.useState(new Date().getFullYear());

  const years = React.useMemo(() => {
    return Array(9)
      .fill(0)
      .map((_, i) => year + (i - 4));
  }, [year]);

  useKeyDown((e) => {
    switch (e.key) {
      case "ArrowUp":
        return setYear((year) => year - 3);
      case "ArrowLeft":
        return setYear((year) => year - 1);
      case "ArrowDown":
        return setYear((year) => year + 3);
      case "ArrowRight":
        return setYear((year) => year + 1);
      default:
        break;
    }
  });

  const isToday = React.useMemo(() => isCurrentYear(), []);

  React.useEffect(() => {
    console.log("YEARS", yearsInfo);
  }, [yearsInfo]);

  return (
    <Page>
      <LoadingOverlay visible={!yearsInfo} error={error} size="2xl" />

      {yearsInfo && (
        <CardContainer
          columns={3}
          children={years.map((year) => (
            <CardLink
              key={year}
              to={`${year}/months`}
              data-empty={!yearsInfo[year]?.daysCount}
              data-highlight={isToday(year)}
              children={year}
            />
          ))}
        />
      )}
    </Page>
  );
};
