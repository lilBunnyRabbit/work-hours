import React from "react";
import { classNames } from "../../utils/class.util";
import "./PaperButton.scss";

export interface PaperButtonProps {
  variant?: "error" | "success";
}

export const PaperButton: React.FC<React.ComponentProps<"button"> & PaperButtonProps> = ({
  variant,
  className,
  ...props
}) => {
  return <button type="button" data-variant={variant} className={classNames("paper-button", className)} {...props} />;
};
