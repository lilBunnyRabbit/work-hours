import React from "react";
import { classNames } from "../utils/class.util";

interface PageProps {
  title?: React.ReactNode;
}

export const Page: React.FC<Omit<React.ComponentProps<"div">, keyof PageProps> & PageProps> = ({
  title,
  className,
  children,
  ...props
}) => {
  return (
    <div className={classNames("flex flex-col justify-between items-center flex-1 gap-8 p-8", className)} {...props}>
      {title && <h1 className="mt-8" children={title} />}

      <div className="flex flex-1 w-full justify-center items-center" children={children} />
    </div>
  );
};
