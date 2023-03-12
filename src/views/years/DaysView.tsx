import React from "react";
import { Link, useParams } from "react-router-dom";
import { CardContainer, CardLink } from "../../components/links/CardLink";
import { Page } from "../../components/Page";
import { generateDays, months } from "../../utils/date.util";
import { useWHFile } from "../../utils/wh-file/useWHFile";

export const DaysView: React.FC = () => {
  const { month, year } = useParams();
  const { hasDay } = useWHFile();
  const days = React.useMemo(() => generateDays(Number(year), Number(month)), [month, year]);

  return (
    <Page
      title={
        <>
          <Link to={`/years/${year}/months`} className="hover:underline" children={months[Number(month)]} />
          &nbsp;
          <Link to="/years" className="hover:underline" children={year} />
        </>
      }
    >
      <CardContainer
        columns={7}
        rows={6}
        children={days.map(({ day, month, year, active }, i) => (
          <CardLink
            key={i}
            to={`${day}`}
            data-disabled={!active}
            data-empty={!hasDay(day, month!, year!)}
            children={day + 1}
          />
        ))}
      />
    </Page>
  );
};
