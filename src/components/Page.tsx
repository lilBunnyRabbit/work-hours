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
    <div
      className={classNames("flex flex-col justify-center items-center w-full h-screen gap-8 p-8", className)}
      {...props}
    >
      {title && <h1 children={title} />}
      {children}
    </div>
  );
};
