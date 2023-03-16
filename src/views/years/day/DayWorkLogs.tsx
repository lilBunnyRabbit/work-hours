import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { PaperButton } from "../../../components/buttons/PaperButton";
import { LogInput } from "../../../components/inputs/log/LogInput";
import { showNotification } from "../../../layouts/Toolbar";
import { formatTime } from "../../../utils/date.util";
import { totalWorkLogTime } from "../../../utils/wh-file/WHFile.util";
import { useDayQuery } from "../../../utils/wh-file/WHFileQueries";
import { IWHFileDay } from "../../../utils/wh-file/WHFileTypes";
import { DayColumn } from "./DayView";

export const DayWorkLogs: React.FC = () => {
  const params = useParams();
  const {
    data: day,
    error,
    isLoading,
    refetch,
    handler: dayHandler,
  } = useDayQuery(params.year!, params.month!, params.day!);
  const workLogs = React.useMemo(() => day?.workLogs || [], [day]);
  const totalTime = React.useMemo(() => totalWorkLogTime(workLogs), [workLogs]);

  const updateMutation = useMutation(["day-update", params.year, params.month, params.day], dayHandler.update, {
    onSuccess: () => refetch(),
    onError: (error: any) => {
      showNotification({
        type: "success",
        title: "Failed to update day",
        description: error?.message,
      });
    },
  });

  return (
    <DayColumn
      title={
        <div className="w-full flex justify-between items-end">
          <div>Work Log</div> <div className="text-[24px]">{formatTime(totalTime)}</div>
        </div>
      }
      loading={isLoading}
      error={error}
    >
      <div className="work-logs flex flex-col gap-4 pr-4 overflow-y-scroll">
        {workLogs.map((workLog) => (
          <WorkLog key={`work-log-${workLog.id}`} workLog={workLog} updateDay={updateMutation.mutate} />
        ))}
      </div>

      <PaperButton
        disabled={(!!workLogs.length && !workLogs[workLogs.length - 1].to) || updateMutation.isLoading}
        onClick={() => {
          updateMutation.mutate((day) => {
            day.workLogs = [...day.workLogs, { id: uuidv4(), from: new Date().toISOString() }];
            return day;
          });
        }}
        children="Add"
      />
    </DayColumn>
  );
};

interface WorkLogProps {
  workLog: IWHFileDay["workLogs"][number];
  updateDay: UseMutateFunction<IWHFileDay, any, (day: IWHFileDay) => IWHFileDay | Promise<IWHFileDay>, unknown>;
}

const WorkLog: React.FC<WorkLogProps> = ({ workLog, updateDay }) => {
  return (
    <LogInput
      key={`work-log-${workLog.id}`}
      workLog={workLog}
      onDelete={() =>
        updateDay((day) => {
          day.workLogs = day.workLogs.filter(({ id }) => id !== workLog.id);
          return day;
        })
      }
      onChange={(updatedWorkLog) => {
        updateDay((day) => {
          const index = day.workLogs.findIndex(({ id }) => id === workLog.id);
          if (index < 0) return day;
          day.workLogs[index] = updatedWorkLog;
          return day;
        });
      }}
    />
  );
};
