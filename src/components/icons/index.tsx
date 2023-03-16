import React from "react";
import { AlertIcon } from "./definitions/AlertIcon";
import { BarsLoaderIcon } from "./definitions/BarsLoaderIcon";
import { ChevronLeftIcon } from "./definitions/ChevronLeftIcon";
import { ChevronRightIcon } from "./definitions/ChevronRightIcon";
import { DeleteIcon } from "./definitions/DeleteIcon";
import { EditIcon } from "./definitions/EditIcon";
import { FileIcon } from "./definitions/FileIcon";
import { FileTextIcon } from "./definitions/FileTextIcon";
import { PrintIcon } from "./definitions/PrintIcon";
import { SaveIcon } from "./definitions/SaveIcon";
import { TrashIcon } from "./definitions/TrashIcon";

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
  File: FileIcon,
  FileText: FileTextIcon,
  Edit: EditIcon,
  Delete: DeleteIcon,
  Save: SaveIcon,
  Print: PrintIcon,
  Trash: TrashIcon,
} satisfies Record<string, Icon>;
