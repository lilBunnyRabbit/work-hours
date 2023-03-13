import React from "react";
import { Navigate, Outlet, useLocation, useMatch } from "react-router-dom";
import { Notifications } from "../components/notifications/Notifications";
import { useWHFile } from "../utils/wh-file/useWHFile";

export const AppLayout: React.FC = () => {
  const { metadata, whFile } = useWHFile();
  const location = useLocation();
  const isIndexView = useMatch({ path: "/", end: true });

  if (!isIndexView && !whFile) {
    return <Navigate to="/" state={{ location }} />;
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <Outlet />

      {metadata && (
        <div
          className="fixed top-0 left-0 px-2 pt-1 z-50 text-sm text-zinc-900 bg-zinc-300"
          children={metadata.filename}
        />
      )}

      <Notifications />
    </div>
  );
};
