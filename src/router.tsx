import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { IndexView } from "./views/IndexView";
import { YearsView } from "./views/years/YearsView";
import { MonthsView } from "./views/years/MonthsView";
import { DaysView } from "./views/years/DaysView";
import { DayView } from "./views/years/DayView";

export const router = createBrowserRouter([
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
    ],
  },
]);
