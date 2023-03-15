import React from "react";
import { Navigate, Outlet, useLocation, useMatch } from "react-router-dom";
import { useWHFile } from "../utils/wh-file/useWHFile";
import { Toolbar } from "./Toolbar";

export const AppLayout: React.FC = () => {
  const { whFile } = useWHFile();
  const location = useLocation();
  const isIndexView = useMatch({ path: "/", end: true });

  if (!isIndexView && !whFile) {
    return <Navigate to="/" state={{ location }} />;
  }

  return (
    <div className="relative grid w-screen h-screen overflow-y-hidden" style={{ gridTemplateRows: "1fr min-content" }}>
      <main className="overflow-hidden">
        <Outlet />
      </main>

      <div>
        <Toolbar />
      </div>
    </div>
  );
};
