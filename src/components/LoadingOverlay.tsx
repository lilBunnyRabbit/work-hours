import React from "react";
import { classNames } from "../utils/class.util";
import { Loader, LoaderProps } from "./Loader";

interface LoadingOverlayProps {
  visible?: boolean;
  error?: any;
  overlay?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps & LoaderProps> = ({
  visible = true,
  error,
  overlay,
  className,
  ...props
}) => {
  if (!visible) return <></>;

  return (
    <div
      className={classNames(
        "flex w-full h-full justify-center items-center",
        overlay && "absolute top-0 left-0 bottom-0 right-0 z-50 bg-[rgba(24,24,27,0.5)]"
      )}
    >
      <Loader className={classNames(error && "text-red-600", className)} {...props} />
    </div>
  );
};
