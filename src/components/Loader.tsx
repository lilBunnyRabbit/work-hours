import React from "react";
import { Icon } from "./icons";

const sizes = {
  "2xl": { width: 128, height: 128 },
  xl: { width: 64, height: 64 },
  lg: { width: 48, height: 48 },
  md: { width: 32, height: 32 },
  sm: { width: 16, height: 16 },
} satisfies Record<string, { width: number; height: number }>;

export interface LoaderProps {
  className?: string;
  size?: keyof typeof sizes;
}

export const Loader: React.FC<Omit<React.ComponentProps<"svg">, keyof LoaderProps> & LoaderProps> = ({
  size = "md",
  ...props
}) => {
  return <Icon.BarsLoader {...sizes[size]} {...props} />;
};
