import React from "react";
import { Navigate, Outlet, useMatch } from "react-router-dom";
import { useWHFile } from "../utils/wh-file/useWHFile";

export const AppLayout: React.FC = () => {
  const { metadata, whFile } = useWHFile();
  const isIndexView = useMatch({ path: "/", end: true });

  if (!isIndexView && !whFile) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col w-screen h-screen">
      <Outlet />

      {metadata && (
        <div className="fixed bottom-0 left-0 px-2 pt-1 z-50 text-sm bg-zinc-800" children={metadata.filename} />
      )}
    </div>
  );
};
