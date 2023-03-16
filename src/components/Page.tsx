import React from "react";
import { classNames } from "../utils/class.util";

export const Page: React.FC<React.ComponentProps<"div">> = ({ title, className, children, ...props }) => {
  return (
    <div
      className={classNames("flex flex-col justify-between items-center w-full h-full gap-16 p-6 relative", className)}
      {...props}
    >
      {title && <h1 className="text-center w-full mt-8" children={title} />}

      <div className="flex w-full h-full justify-center items-center relative overflow-hidden" children={children} />
    </div>
  );
};
