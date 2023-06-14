import React from "react";
import { Icon } from "../components/icons";
import { useAutoQueue } from "../hooks/useAutoQueue";
import { classNames } from "../utils/class.util";
import { createEventHandler, useEventHandler } from "../utils/event.util";
import { useWHFile } from "../wh-file/context/WHFileHooks";
import "./Toolbar.scss";

export interface NotificationEvent {
  title: string;
  description?: string;
  type?: "error" | "success";
}

export const notificationEventHandler = createEventHandler<NotificationEvent>("notification");
export const showNotification = notificationEventHandler.dispatch;

export type FileEvent = {
  action: "writing";
  active: boolean;
};

export const fileEventHandler = createEventHandler<FileEvent>("file");
export const sendFileEvent = fileEventHandler.dispatch;

export const Toolbar: React.FC = () => {
  const { manager } = useWHFile();

  const [writingFile, setWritingFile] = React.useState(false);

  const { item: notification, add: addNotification } = useAutoQueue<NotificationEvent>();

  useEventHandler(notificationEventHandler, ({ detail: notification }) => {
    addNotification(notification);
  });

  useEventHandler(fileEventHandler, ({ detail }) => {
    switch (detail.action) {
      case "writing":
        setWritingFile(detail.active);
        break;

      default:
        break;
    }
  });

  return (
    <div className="toolbar flex w-screen h-[26px] px-2 items-center justify-between text-xs leading-[100%] text-zinc-400 font-light bg-[#101012] border-t border-t-zinc-700">
      <div className="flex flex-row items-end gap-4">
        {manager && (
          <>
            <ToolbarItem icon={writingFile ? Icon.FileText : Icon.File} children={manager.handler.metadata.name} />
            {manager.lastSynch !== manager.lastUpdate && (
              <ToolbarItem
                className="toolbar-notification"
                data-type="error"
                icon={Icon.Alert}
                children="Not synched!"
              />
            )}
          </>
        )}
      </div>

      {notification && (
        <div
          className="toolbar-notification flex flex-row items-end gap-1 max-w-[50vw]"
          data-type={notification.type || "error"}
        >
          <Icon.Alert color="currentColor" height={14} />
          <div className="truncate">
            <span className="font-normal">{notification.title}</span>
            {notification.description && ` - ${notification.description}`}
          </div>
        </div>
      )}
    </div>
  );
};

interface ToolbarItemProps {
  icon?: Icon;
}

const ToolbarItem: React.FC<React.ComponentProps<"div"> & ToolbarItemProps> = ({
  icon,
  className,
  children,
  ...props
}) => {
  return (
    <div className={classNames("flex flex-row items-end gap-1", className)} {...props}>
      {icon && React.createElement(icon, { color: "currentColor", height: 14 })}
      {children}
    </div>
  );
};
