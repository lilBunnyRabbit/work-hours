import React from "react";
import { useStopWatch, UseStopWatchProps } from "../../../hooks/useStopwatch";
import { classNames } from "../../../utils/class.util";
import { parseTime } from "../../../utils/date.util";
import { IWHFileDay } from "../../../utils/wh-file/WHFileTypes";
import { IconButton } from "../../buttons/IconButton";
import { PaperButton } from "../../buttons/PaperButton";
import { MarkdownEditor } from "../../editors/markdown/MarkdownEditor";
import { Icon } from "../../icons";
import { Loader } from "../../Loader";
import "./LogInput.scss";

const padTime = (time: number) => String(time).padStart(2, "0");

const formatTime = (time: ReturnType<typeof parseTime>) => {
  return `${padTime(time.hours)}:${padTime(time.minutes)}:${padTime(time.seconds)}`;
};

type TimeValue = `${number}:${number}`;

const dateToTimeValue = (date: Date): TimeValue => {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}` as TimeValue;
};

const timeValueToDate = (timeValue: TimeValue): Date => {
  const [hours, minutes] = timeValue.split(":");
  const date = new Date();
  date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
  return date;
};

interface LogInputProps {
  workLog: IWHFileDay["workLogs"][number];
  onDelete?: () => void;
  onChange?: (workLog: IWHFileDay["workLogs"][number]) => void;
}

export const LogInput: React.FC<LogInputProps> = ({ workLog, onDelete, onChange }) => {
  const [editing, setEditing] = React.useState<boolean>(false);
  const [deleting, setDeleting] = React.useState(false);

  const [note, setNote] = React.useState<string>(workLog.note || "");

  const { fromDate, toDate, from, to } = React.useMemo(() => {
    const fromDate = new Date(workLog.from);
    const toDate = workLog.to ? new Date(workLog.to) : undefined;

    return {
      fromDate,
      toDate,
      from: dateToTimeValue(fromDate),
      to: toDate ? dateToTimeValue(toDate) : undefined,
    };
  }, [workLog]);

  const stopWatchProps: UseStopWatchProps = React.useMemo(
    () => ({
      startTime: fromDate.getTime(),
      endTime: toDate?.getTime(),
    }),
    [fromDate, toDate]
  );

  const icon = React.useMemo(() => {
    return React.createElement(editing ? Icon.Save : Icon.Edit, {
      height: 20,
      ...(editing && { className: "text-lime-600" }),
    });
  }, [editing]);

  const handleChange = React.useCallback(
    (partial: Partial<typeof workLog>) => {
      if (!onChange) return;
      onChange({ ...workLog, ...partial });
    },
    [onChange, workLog]
  );

  const overlay = React.useMemo(() => {
    if (deleting) {
      return (
        <div className="grid grid-cols-[1fr_min-content_min-content] w-full h-full items-center gap-2">
          Delete log?
          <LogInputButton onClick={() => setDeleting(false)} children="Cancel" />
          <LogInputButton onClick={onDelete} variant="error" children="Delete" />
        </div>
      );
    }
  }, [deleting]);

  React.useEffect(() => {
    setNote(workLog.note || "");
  }, [workLog.note]);

  return (
    <div className="log-input relative flex flex-col w-full border border-zinc-300 bg-zinc-900">
      <div
        className={classNames(
          "grid grid-cols-[min-content_min-content_1fr_min-content] gap-4 w-full py-2 px-4 items-center",
          (editing || note) && "border-b border-b-zinc-300"
        )}
      >
        <input
          type="time"
          min="00:00"
          max={to || "24:00"}
          value={from || ""}
          onChange={(e) => handleChange({ from: timeValueToDate(e.target.value as TimeValue).toISOString() })}
        />

        {to ? (
          <input
            type="time"
            min={from || "00:00"}
            max="24:00"
            value={to || ""}
            onChange={(e) => handleChange({ to: timeValueToDate(e.target.value as TimeValue).toISOString() })}
          />
        ) : (
          <LogInputButton
            variant="success"
            onClick={() => handleChange({ to: new Date().toISOString() })}
            children="STOP"
          />
        )}

        <TimeDisplay {...stopWatchProps} />

        <div className="flex flex-row items-center gap-2">
          <IconButton
            title={editing ? "Save note" : "Edit note"}
            onClick={() => {
              setEditing(!editing);
              if (editing) {
                handleChange({ note: note });
              }
            }}
            children={icon}
          />
          <IconButton title="Delete log" className="hover:text-red-600" onClick={() => setDeleting(true)}>
            <Icon.Delete height={24} />
          </IconButton>
        </div>
      </div>

      <MarkdownEditor
        value={note || ""}
        onChange={setNote}
        className="flex-1 bg-zinc-800"
        editing={editing}
        placeholder="Note..."
        setEditing={setEditing}
      />

      {overlay && (
        <div className="absolute top-0 left-0 right-0 bottom-0 grid bg-inherit items-center px-4" children={overlay} />
      )}
    </div>
  );
};

const LogInputButton: React.FC<React.ComponentProps<typeof PaperButton>> = ({ className, ...props }) => {
  return <PaperButton className={classNames("p-0 h-[28px] w-[75.19px]", className)} {...props} />;
};

const TimeDisplay: React.FC<UseStopWatchProps> = (props) => {
  const { time } = useStopWatch(props);
  return <span className="text-center text-lg" children={formatTime(time)} />;
};
