import React from "react";
import { createEventHandler, useEventHandler } from "../../utils/event.util";
import "./Notifications.scss";

export interface EventNotificationData {
  title: string;
  description?: string;
  type?: "error" | "success";
}

export const notificationEventHandler = createEventHandler<EventNotificationData>("notification");

export const showNotification = notificationEventHandler.dispatch;

interface NotificationData extends EventNotificationData {
  id: number;
}

interface NotificationsProps {
  delay?: number;
}

export const Notifications: React.FC<NotificationsProps> = ({ delay = 2500 }) => {
  const [notifications, setNotifications] = React.useState<NotificationData[]>([]);

  useEventHandler(notificationEventHandler, ({ detail: notification }) => {
    const id = Date.now();
    setNotifications((notifications) => [...notifications, { ...notification, id }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, delay);
  });

  return (
    <div className="fixed top-0 right-0 flex flex-col gap-4 z-[9999] p-4">
      {notifications.map((notification) => (
        <Notification key={`notfication-${notification.id}`} notification={notification} />
      ))}
    </div>
  );
};

interface NotificationProps {
  notification: NotificationData;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  return (
    <div className="notification" data-type={notification.type}>
      <p className="notification-title truncate" children={notification.title} />
      {notification.description && <p className="notification-description" children={notification.description} />}
    </div>
  );
};
