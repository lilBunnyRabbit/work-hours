import { useQuery } from "@tanstack/react-query";
import React from "react";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { useKeyDown } from "../../hooks/useKeyDown";
import { useYears } from "../../utils/wh-file/WHFileHooks";

export const YearsView: React.FC = () => {
  const yearsHandler = useYears();
  const { data: yearsInfo, error } = useQuery(["years-info"], yearsHandler.getInfo)

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

  React.useEffect(() => {
    console.log("YEARS", yearsInfo);
  }, [yearsInfo]);

  return (
    <Page title="Select year">
      <LoadingOverlay visible={!yearsInfo} error={error} size="2xl" />

      {yearsInfo && (
        <CardContainer
          columns={3}
          rows={3}
          children={years.map((year) => (
            <CardLink key={year} to={`${year}/months`} data-empty={!yearsInfo[year]?.daysCount} children={year} />
          ))}
        />
      )}
    </Page>
  );
};
