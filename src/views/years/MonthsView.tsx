import React from "react";
import { Link, useParams } from "react-router-dom";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { Page } from "../../components/Page";
import { months } from "../../utils/date.util";
import { useWHFile } from "../../utils/wh-file/useWHFile";

export const MonthsView: React.FC = () => {
  const { year } = useParams();
  const { hasMonth } = useWHFile();

  return (
    <Page title={<Link to="/years" className="hover:underline" children={year} />}>
      <CardContainer
        columns={4}
        rows={3}
        children={months.map((month, i) => (
          <CardLink key={month} to={`${i}/days`} data-empty={!hasMonth(i, year!)} children={month} />
        ))}
      />
    </Page>
  );
};
