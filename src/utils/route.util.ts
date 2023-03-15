import { Path, To } from "react-router-dom";

export type RouteTo =
  | To
  | (Partial<Omit<Path, "pathname">> & {
      route: string; // TODO: const, variables
    });
