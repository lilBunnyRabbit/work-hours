import React from "react";
import { classNames } from "../../utils/class.util";
import "./PaperButton.scss";

export const PaperButton: React.FC<React.ComponentProps<"button">> = ({ className, ...props }) => {
  return <button type="button" className={classNames("paper-button", className)} {...props} />;
};
