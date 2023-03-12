import React from "react";
import { PaperButton } from "../../components/buttons/PaperButton";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { useAsync } from "../../hooks/useAsync";
import { useKeyDown } from "../../hooks/useKeyDown";
import { useWHFile } from "../../utils/wh-file/useWHFile";
import { INITIAL_DAY, WHF_VERSION } from "../../utils/wh-file/WHFile";

export const YearsView: React.FC = () => {
  const { getYears, getDaysCount } = useWHFile();
  const { data, error } = useAsync(getYears);
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
    console.log("YEARS", data);
  }, [data]);

  return (
    <Page>
      <LoadingOverlay visible={!data} error={error} size="xl" />
      {data && (
        <CardContainer
          columns={3}
          rows={3}
          children={years.map((year) => (
            <CardLink key={year} to={`${year}/months`} data-empty={!getDaysCount(year)} children={year} />
          ))}
        />
      )}
    </Page>
  );
};
