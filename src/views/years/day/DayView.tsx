import React from "react";
import { Outlet } from "react-router-dom";
import { LoadingOverlay } from "../../../components/LoadingOverlay";
import { Page } from "../../../components/Page";
import { classNames } from "../../../utils/class.util";
import { DayNotes } from "./DayNotes";
import { DayReport } from "./DayReport";
import "./DayView.scss";
import { DayWorkLogs } from "./DayWorkLogs";

export const DayView: React.FC = () => {
  return (
    <>
      <Page className="day-view">
        <div className="relative grid gap-8 w-full h-full overflow-hidden grid-cols-[450px_1fr_1fr] max-w-[2000px]">
          <DayWorkLogs />
          <DayNotes />
          <DayReport />
        </div>
      </Page>

      <Outlet />
    </>
  );
};

interface DayColumnProps {
  title?: React.ReactNode;
  loading?: boolean;
  error?: any;
}

export const DayColumn: React.FC<Omit<React.ComponentProps<"div">, keyof DayColumnProps> & DayColumnProps> = ({
  title,
  loading,
  error,
  className,
  children,
  ...props
}) => {
  return (
    <div className={classNames("relative flex flex-col max-h-full overflow-hidden gap-4", className)} {...props}>
      {title && <h2 className="w-full border-b border-b-zinc-300" children={title} />}
      <div className="relative flex flex-col flex-1 max-h-full overflow-hidden gap-4">
        {children}
        <LoadingOverlay overlay visible={!!loading} error={error} size="2xl" />
      </div>
    </div>
  );
};
