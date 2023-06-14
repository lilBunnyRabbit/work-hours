import React from "react";
import { Page } from "../../components/Page";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { useKeyDown } from "../../hooks/useKeyDown";
import { isCurrentYear } from "../../utils/date.util";
import { useYears } from "../../wh-file/context/WHFileHooks";

export const YearsView: React.FC = () => {
  const { years, info } = useYears();

  const [year, setYear] = React.useState(new Date().getFullYear());

  const yearsList = React.useMemo(() => {
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
    console.log("YEARS", { years, info });
  }, [years, info]);

  return (
    <Page>
      {info && (
        <CardContainer
          columns={3}
          children={yearsList.map((year) => (
            <CardLink
              key={year}
              to={`${year}/months`}
              data-empty={!info[year]?.daysCount}
              data-highlight={isToday(year)}
              children={year}
            />
          ))}
        />
      )}
    </Page>
  );
};
