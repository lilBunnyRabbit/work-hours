import React from "react";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { PaperButton } from "../../components/buttons/PaperButton";
import { LogInput } from "../../components/inputs/log/LogInput";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { Page } from "../../components/Page";
import { useAsyncQuery, useAsyncMutation } from "../../hooks/useAsync";
import { showNotification } from "../../layouts/Toolbar";
import { classNames } from "../../utils/class.util";
import { formatDay, months } from "../../utils/date.util";
import { useDay } from "../../utils/wh-file/WHFileHooks";
import { IWHFileDay } from "../../utils/wh-file/WHFileTypes";
import "./DayView.scss";

export const DayView: React.FC = () => {
  const params = useParams();
  const dayHandler = useDay(params.year!, params.month!, params.day!);
  const { data: day, error, refetch } = useAsyncQuery(dayHandler.get);
  const dayMutation = useAsyncMutation(dayHandler.update, {
    onSuccess: refetch,
    onError: (error) => {
      showNotification({
        type: "success",
        title: "Failed to updated day",
        description: error?.message,
      });
    },
  });

  const workLogs = React.useMemo(() => day?.workLogs || [], [day]);

  return (
    <Page
      className="day-view"
      title={
        <>
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
        </>
      }
    >
      <LoadingOverlay visible={!day} error={error} size="2xl" />

      {day && (
        <div className="relative flex flex-row w-full h-full flex-wrap justify-between overflow-hidden">
          <DayColumn className="w-[450px]" title="Work Log">
            <div className="work-logs flex flex-col gap-4 pr-4 overflow-y-scroll">
              {workLogs.map((workLog, i) => (
                <DayLogInput
                  key={`work-log-${workLog.id}`}
                  workLog={workLog}
                  updateDay={dayHandler.update}
                  onRefetch={refetch}
                />
              ))}
            </div>
            <PaperButton
              disabled={(!!workLogs.length && !workLogs[workLogs.length - 1].to) || dayMutation.isLoading}
              onClick={() => {
                dayMutation.execute((day) => {
                  day.workLogs = [...day.workLogs, { id: uuidv4(), from: new Date().toISOString() }];
                  return day;
                });
              }}
              children="Add"
            />
          </DayColumn>
        </div>
      )}
    </Page>
  );
};

const DayColumn: React.FC<React.ComponentProps<"div">> = ({ title, className, children, ...props }) => {
  return (
    <div className={classNames("flex flex-col max-h-full overflow-hidden px-6 gap-4", className)} {...props}>
      {title && <h2 className="w-full border-b border-b-zinc-300" children={title} />}
      {children}
    </div>
  );
};

interface DayLogInputProps {
  workLog: IWHFileDay["workLogs"][number];
  updateDay: ReturnType<typeof useDay>["update"];
  onRefetch: () => void;
}

const DayLogInput: React.FC<DayLogInputProps> = ({ workLog, updateDay, onRefetch }) => {
  const dayMutation = useAsyncMutation(updateDay, {
    onSuccess: onRefetch,
    onError: (error) => {
      showNotification({
        type: "success",
        title: "Failed to updated work log",
        description: error?.message,
      });
    },
  });

  return (
    <LogInput
      key={`work-log-${workLog.id}`}
      workLog={workLog}
      onDelete={() =>
        dayMutation.execute((day) => {
          day.workLogs = day.workLogs.filter(({ id }) => id !== workLog.id);
          return day;
        })
      }
      onChange={(updatedWorkLog) => {
        dayMutation.execute((day) => {
          const index = day.workLogs.findIndex(({ id }) => id === workLog.id);
          if (index < 0) return day;
          day.workLogs[index] = updatedWorkLog;
          return day;
        });
      }}
    />
  );
};
