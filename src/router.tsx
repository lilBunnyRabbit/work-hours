import { createBrowserRouter } from "react-router-dom";
import { IndexView } from "./views/IndexView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexView />,
  },
]);
