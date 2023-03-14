import React from "react";

interface useAutoQueueProps<T> {
  delay?: number;
}

export function useAutoQueue<T>({ delay = 2500 }: useAutoQueueProps<T> = {}) {
  const [queue, setQueue] = React.useState<T[]>([]);

  const interval = React.useRef<ReturnType<typeof setInterval>>();

  const add = React.useCallback(
    (item: T) => {
      setQueue((queue) => [...queue, item]);

      if (!interval.current) {
        interval.current = setInterval(() => {
          setQueue((queue) => {
            const [_, ...rest] = queue;

            if (rest.length === 0) {
              clearInterval(interval.current);
              interval.current = undefined;
            }

            return rest;
          });
        }, delay);
      }
    },
    [delay]
  );

  React.useEffect(() => {
    return () => {
      // setQueue([]);

      if (interval.current) {
        clearInterval(interval.current);
        interval.current = undefined;
      }
    };
  }, []);

  return { queue, add, item: queue[0] };
}
