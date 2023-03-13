import { createHashRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { IndexView } from "./views/IndexView";
import { DaysView } from "./views/years/DaysView";
import { DayView } from "./views/years/DayView";
import { MonthsView } from "./views/years/MonthsView";
import { YearsView } from "./views/years/YearsView";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <IndexView />,
      },
      {
        path: "years",
        children: [
          {
            index: true,
            element: <YearsView />,
          },
          {
            path: ":year/months",
            children: [
              {
                index: true,
                element: <MonthsView />,
              },
              {
                path: ":month/days",
                children: [
                  {
                    index: true,
                    element: <DaysView />,
                  },
                  {
                    path: ":day",
                    element: <DayView />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/years" />,
      },
    ],
  },
]);
