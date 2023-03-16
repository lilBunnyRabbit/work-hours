import React from "react";
import { useFirstHandleValue } from "../hooks/useFirstHandleValue";
import { isFunction } from "../utils/type.util";

export const Header: React.FC = () => {
  const routeHeader = useFirstHandleValue("Header", isFunction);
  const routeHeaderRender = React.useMemo(() => routeHeader && React.createElement(routeHeader), [routeHeader]);

  return (
    <div
      className="relative flex flex-row items-center px-6 h-[52px] w-screen text-zinc-300 text-[22px] bg-[#101012] border-b border-b-zinc-700"
      children={routeHeaderRender}
    />
  );
};
