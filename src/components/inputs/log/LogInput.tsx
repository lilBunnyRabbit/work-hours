import React from "react";
import { useStopWatch, UseStopWatchProps } from "../../../hooks/useStopwatch";
import "./LogInput.scss";

type TimeValue = `${number}:${number}`;

interface LogInputProps {}

export const LogInput: React.FC<LogInputProps> = ({}) => {
  const [startTime, setStartTime] = React.useState<TimeValue>();
  const [endTime, setEndTime] = React.useState<TimeValue>();

  const stopWatchProps: UseStopWatchProps = React.useMemo(() => {
    const props: UseStopWatchProps = {};
    console.log({ startTime, endTime });

    if (startTime) {
      const [hours, minutes] = startTime.split(":");
      props.startTime = new Date().setHours(Number.parseInt(hours), Number.parseInt(minutes));
    }

    if (endTime) {
      const [hours, minutes] = endTime.split(":");
      props.endTime = new Date().setHours(Number.parseInt(hours), Number.parseInt(minutes));
    }

    return props;
  }, [startTime, endTime]);

  const { time } = useStopWatch(stopWatchProps);

  return (
    <div>
      <div className="flex flex-row gap-4">
        <input
          type="time"
          min="00:00"
          max={endTime || "24:00"}
          value={startTime || ""}
          onChange={(e) => setStartTime(e.target.value as TimeValue)}
        />
        <input
          type="time"
          min={startTime || "00:00"}
          max="24:00"
          value={endTime || ""}
          onChange={(e) => setEndTime(e.target.value as TimeValue)}
        />
        <span>{`${time.hours}h ${time.minutes}min ${time.seconds}:${time.milliseconds}`}</span>
      </div>
    </div>
  );
};
