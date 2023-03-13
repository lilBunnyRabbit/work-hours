import React from "react";

const EVENT_PREFIX = "custom-event";

export interface EventHandler<T> {
  listen: (callback: (event: CustomEvent<T>) => void) => void;
  remove: (callback: (event: CustomEvent<T>) => void) => void;
  dispatch: (detail: T) => boolean;
}

export function createEventHandler<T>(key: string): EventHandler<T> {
  const eventKey = `${EVENT_PREFIX}:${key}`;
  return {
    listen: (callback: (event: CustomEvent<T>) => void) => window.addEventListener(eventKey, callback as any),
    remove: (callback: (event: CustomEvent<T>) => void) => window.removeEventListener(eventKey, callback as any),
    dispatch: (detail: T) => window.dispatchEvent(new CustomEvent(eventKey, { detail })),
  };
}

export function useEventHandler<T>(handler: EventHandler<T>, callback: Parameters<EventHandler<T>["listen"]>[0]) {
  React.useEffect(() => {
    handler.listen(callback);
    return () => handler.remove(callback);
  }, [handler, callback]);
}
