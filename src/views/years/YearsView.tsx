import React from "react";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { Page } from "../../components/Page";
import { useWHFile } from "../../utils/wh-file/useWHFile";

export const YearsView: React.FC = () => {
  const { hasYear } = useWHFile();
  const [year, setYear] = React.useState(new Date().getFullYear());

  const years = React.useMemo(() => {
    return Array(9)
      .fill(0)
      .map((_, i) => year + (i - 4));
  }, [year]);

  return (
    <Page>
      <CardContainer
        columns={3}
        rows={3}
        children={years.map((year) => (
          <CardLink key={year} to={`${year}/months`} data-empty={!hasYear(year)} children={year} />
        ))}
      />
    </Page>
  );
};
