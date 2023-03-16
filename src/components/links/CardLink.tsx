import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { classNames } from "../../utils/class.util";
import "./CardLink.scss";

export const CardLink: React.FC<LinkProps> = ({ className, ...props }) => {
  return <Link className={classNames("card-link", className)} {...props} />;
};

interface CardContainerProps {
  columns: number;
}

export const CardContainer: React.FC<React.ComponentProps<"div"> & CardContainerProps> = ({
  columns,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={classNames("grid w-full h-full gap-4 max-w-[640px] justify-center content-center relative", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        ...style,
      }}
      {...props}
    />
  );
};
