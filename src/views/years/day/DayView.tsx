import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PaperButton } from "../../../components/buttons/PaperButton";
import { LoadingOverlay } from "../../../components/LoadingOverlay";
import { Page } from "../../../components/Page";
import { useAsyncMutation } from "../../../hooks/useAsync";
import { showNotification } from "../../../layouts/Toolbar";
import { classNames } from "../../../utils/class.util";
import { formatDay, months } from "../../../utils/date.util";
import { useDay } from "../../../utils/wh-file/WHFileHooks";
import { DayNotes } from "./DayNotes";
import "./DayView.scss";
import { DayWorkLogs } from "./DayWorkLogs";

export const DayView: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const dayHandler = useDay(params.year!, params.month!, params.day!);

  const deleteMutation = useAsyncMutation(dayHandler.remove, {
    onSuccess: () => {
      showNotification({
        type: "success",
        title: "Deleted day",
      });

      navigate(`/years/${params.year}/months/${params.month}/days`);
    },
    onError: (error) => {
      showNotification({
        type: "success",
        title: "Failed to delete day",
        description: error?.message,
      });
    },
  });

  return (
    <Page
      className={classNames("day-view", deleteMutation.isLoading && "opacity-50")}
      title={
        <div className="grid grid-cols-[1fr_min-content_1fr] w-full gap-6">
          <div />
          <div>
            <Link
              to={`/years/${params.year}/months`}
              className="hover:underline"
              children={months[Number(params.month)]}
            />
            &nbsp;
            <Link
              to={`/years/${params.year}/months/${params.month}/days`}
              className="hover:underline"
              children={formatDay(Number(params.day) + 1)}
            />
            &nbsp;
            <Link to="/years" className="hover:underline" children={params.year} />
          </div>

          <div className="flex flex-row justify-end items-center w-full text-[18px]">
            <PaperButton
              disabled={deleteMutation.isLoading}
              variant="error"
              className="h-[46px]"
              onClick={deleteMutation.execute}
              children="Delete"
            />
          </div>
        </div>
      }
    >
      <div className="relative grid w-full h-full overflow-hidden grid-cols-[450px_1fr]">
        <DayWorkLogs />

        <DayNotes />

        {/* <DayColumn title="Report"></DayColumn> */}
      </div>

      <LoadingOverlay overlay visible={deleteMutation.isLoading} error={deleteMutation.error} size="2xl" />
    </Page>
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
    <div className={classNames("relative flex flex-col max-h-full overflow-hidden px-6 gap-4", className)} {...props}>
      {title && <h2 className="w-full border-b border-b-zinc-300" children={title} />}
      <div className="relative flex flex-col flex-1 max-h-full overflow-hidden gap-4">
        {children}
        <LoadingOverlay overlay visible={!!loading} error={error} size="2xl" />
      </div>
    </div>
  );
};
