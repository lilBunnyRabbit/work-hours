import React from "react";
import { Icon } from "../components/icons";
import { useAutoQueue } from "../hooks/useAutoQueue";
import { createEventHandler, useEventHandler } from "../utils/event.util";
import { useWHFile } from "../utils/wh-file/useWHFile";
import "./Toolbar.scss";

export interface NotificationData {
  title: string;
  description?: string;
  type?: "error" | "success";
}

export const notificationEventHandler = createEventHandler<NotificationData>("notification");

export const showNotification = notificationEventHandler.dispatch;

export const Toolbar: React.FC = () => {
  const { metadata } = useWHFile();

  const { item: notification, add: addNotification } = useAutoQueue<NotificationData>();

  useEventHandler(notificationEventHandler, ({ detail: notification }) => {
    addNotification(notification);
  });

  return (
    <footer
      className="toolbar flex w-screen h-[26px] px-2 items-center justify-between text-[11px] text-[#8D8D9E] font-light bg-[#101012]"
      style={{ lineHeight: "11px" }}
    >
      <div className="flex flex-row items-center gap-1">
        {metadata && (
          <>
            <Icon.File color="currentColor" height={14} />
            {metadata.filename}
          </>
        )}
      </div>

      {notification && (
        <div
          className="toolbar-notification flex flex-row items-center gap-1 max-w-[33vw]"
          data-type={notification.type || "error"}
        >
          <Icon.Alert color="currentColor" height={14} />
          <div className="truncate">
            <span className="font-normal">{notification.title}</span>
            {notification.description && ` - ${notification.description}`}
          </div>
        </div>
      )}
    </footer>
  );
};
