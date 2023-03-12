import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { classNames } from "../../utils/class.util";
import "./CardLink.scss";

export const CardLink: React.FC<LinkProps> = ({ className, ...props }) => {
  return <Link className={classNames("card-link", className)} {...props} />;
};

interface CardContainerProps {
  columns: number;
  rows: number;
}

export const CardContainer: React.FC<React.ComponentProps<"div"> & CardContainerProps> = ({
  columns,
  rows,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={classNames("grid w-full h-fit gap-4 max-w-[640px] justify-center content-center", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, ...style }}
      {...props}
    />
  );
};
