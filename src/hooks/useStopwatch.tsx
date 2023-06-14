import React from "react";
import { parseTime } from "../utils/date.util";
import { isUndefined } from "../utils/type.util";
import { TimeValue } from "../utils/time.util";

export interface UseStopWatchProps {
  startTime?: number;
  endTime?: number;
}

export const useStopWatch = ({ startTime: initialStartTime, endTime: initialEndTime }: UseStopWatchProps = {}) => {
  const [startTime, setStartTime] = React.useState<typeof initialStartTime>(() => initialStartTime);
  const [endTime, setEndTime] = React.useState<typeof initialEndTime>(() => initialEndTime);
  const [time, setTime] = React.useState(0);

  const interval = React.useRef<ReturnType<typeof setInterval>>();

  const stop = React.useCallback(() => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }
  }, []);

  React.useEffect(() => {
    if (!isUndefined(startTime)) {
      if (!isUndefined(endTime)) {
        stop();
        setTime(() => (endTime || Date.now()) - startTime);
      } else {
        interval.current = setInterval(() => setTime(() => Date.now() - startTime), 1);
      }
    }

    return stop;
  }, [startTime, endTime, stop]);

  React.useEffect(() => {
    setStartTime(initialStartTime);
  }, [initialStartTime]);

  React.useEffect(() => {
    setEndTime(initialEndTime);
  }, [initialEndTime]);

  return {
    stop,
    time: parseTime(time),
    setStartTime,
    setEndTime,
  };
};

interface TimeValueStopwatchProps {
  start: TimeValue;
  end?: TimeValue;
}

export const TimeValueStopwatch: React.FC<TimeValueStopwatchProps> = ({ start, end }) => {
  const [endTime, setEndTime] = React.useState<TimeValue>();

  const interval = React.useRef<ReturnType<typeof setInterval>>();

  const stop = React.useCallback(() => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }
  }, []);

  React.useEffect(() => {
    if (!isUndefined(start)) {
      if (!isUndefined(end)) {
        stop();
        setEndTime(TimeValue.now());
      } else {
        setEndTime(TimeValue.now());
        interval.current = setInterval(() => setEndTime(TimeValue.now()), 1000);
      }
    }

    return stop;
  }, [start, end]);

  return <span className="text-center" children={endTime && start.durationTo(end || endTime).toString()} />;
};
