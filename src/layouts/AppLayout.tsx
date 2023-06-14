import React from "react";
import { Navigate, Outlet, useLocation, useMatch } from "react-router-dom";
import { useWHFile } from "../wh-file/context/WHFileHooks";
import { Header } from "./Header";
import { Toolbar } from "./Toolbar";

export const AppLayout: React.FC = () => {
  const { handler: whFile } = useWHFile();
  const location = useLocation();
  const isIndexView = useMatch({ path: "/", end: true });
  const isPrintView = useMatch({ path: "/print", end: false });

  if (!isIndexView && !whFile) {
    return <Navigate to="/" state={{ location }} />;
  }

  if (isPrintView) {
    return <Outlet />;
  }

  return (
    <div className="relative grid grid-rows-[min-content_1fr_min-content] w-screen h-screen overflow-y-hidden">
      {!isIndexView && (
        <div>
          <Header />
        </div>
      )}

      <main className="relative overflow-hidden">
        <Outlet />
      </main>

      {!isIndexView && (
        <div>
          <Toolbar />
        </div>
      )}
    </div>
  );
};
