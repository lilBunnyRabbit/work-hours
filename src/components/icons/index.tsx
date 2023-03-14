import React from "react";
import { AlertIcon } from "./definitions/AlertIcon";
import { BarsLoaderIcon } from "./definitions/BarsLoaderIcon";
import { ChevronLeftIcon } from "./definitions/ChevronLeftIcon";
import { ChevronRightIcon } from "./definitions/ChevronRightIcon";

export interface BaseIconProps {
  color?: string;
}

export type Icon<TProps extends object = {}> = React.FC<
  TProps & Omit<React.SVGProps<SVGSVGElement>, "viewBox" | keyof BaseIconProps> & BaseIconProps
>;

export const Icon = {
  BarsLoader: BarsLoaderIcon,
  ChevronLeft: ChevronLeftIcon,
  ChevronRight: ChevronRightIcon,
  Alert: AlertIcon,
} satisfies Record<string, Icon>;