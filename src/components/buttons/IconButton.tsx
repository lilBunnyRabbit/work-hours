import React from "react";
import { classNames } from "../../utils/class.util";
import "./IconButton.scss";

interface IconButtonProps {}

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentProps<"button">, keyof IconButtonProps> & IconButtonProps
>(({ className, ...props }, ref) => {
  return <button ref={ref} className={classNames("icon-button", className)} {...props} />;
});

IconButton.displayName = "IconButton";
