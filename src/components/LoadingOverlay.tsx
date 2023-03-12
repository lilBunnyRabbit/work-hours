import React from "react";
import { classNames } from "../utils/class.util";
import { Loader, LoaderProps } from "./Loader";

interface LoadingOverlayProps {
  visible?: boolean;
  error?: any;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps & LoaderProps> = ({
  visible = true,
  error,
  className,
  ...props
}) => {
  if (!visible) return <></>;

  return (
    <div className="flex w-full h-full justify-center items-center">
      <Loader className={classNames(error && "text-red-600", className)} {...props} />
    </div>
  );
};
