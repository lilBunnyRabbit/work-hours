import { createHashRouter, Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { IconButton } from "./components/buttons/IconButton";
import { Icon } from "./components/icons";
import { AppLayout } from "./layouts/AppLayout";
import { formatDay, months } from "./utils/date.util";
import { IndexView } from "./views/IndexView";
import { DayDeleteView } from "./views/years/day/DayDeleteView";
import { DayView } from "./views/years/day/DayView";
import { DaysView } from "./views/years/DaysView";
import { MonthsView } from "./views/years/MonthsView";
import { PDFView } from "./views/years/PrintView";
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
        handle: {
          Header: () => {
            return "Years";
          },
        },
        children: [
          {
            index: true,
            element: <YearsView />,
          },
          {
            path: ":year/months",
            handle: {
              Header: () => {
                const { year } = useParams();

                return <Link to="/years" className="hover:underline" children={year} />;
              },
            },
            children: [
              {
                index: true,
                element: <MonthsView />,
              },
              {
                path: ":month/days",
                handle: {
                  Header: () => {
                    const { year, month } = useParams();
                    const navigate = useNavigate();

                    return (
                      <div className="flex flex-row items-center justify-between w-full">
                        <div>
                          <Link
                            to={`/years/${year}/months`}
                            className="hover:underline"
                            children={months[Number(month)]}
                          />
                          &nbsp;
                          <Link to="/years" className="hover:underline" children={year} />
                        </div>

                        <IconButton onClick={() => navigate(`/print/${year}/${month}`)}>
                          <Icon.Print className="hover:text-lime-500" height={24} />
                        </IconButton>
                      </div>
                    );
                  },
                },
                children: [
                  {
                    index: true,
                    element: <DaysView />,
                  },
                  {
                    path: ":day",
                    element: <DayView />,
                    handle: {
                      Header: () => {
                        const { year, month, day } = useParams();
                        const navigate = useNavigate();

                        return (
                          <div className="flex flex-row items-center justify-between w-full">
                            <div>
                              <Link
                                to={`/years/${year}/months`}
                                className="hover:underline"
                                children={months[Number(month)]}
                              />
                              &nbsp;
                              <Link
                                to={`/years/${year}/months/${month}/days`}
                                className="hover:underline"
                                children={formatDay(Number(day) + 1)}
                              />
                              &nbsp;
                              <Link to="/years" className="hover:underline" children={year} />
                            </div>

                            <IconButton onClick={() => navigate(`/years/${year}/months/${month}/days/${day}/delete`)}>
                              <Icon.Trash className="hover:text-red-600" height={24} />
                            </IconButton>
                          </div>
                        );
                      },
                    },
                    children: [
                      {
                        path: "delete",
                        element: <DayDeleteView />,
                        handle: {
                          Header: () => {
                            const { year, month, day } = useParams();

                            return (
                              <>
                                <Link
                                  to={`/years/${year}/months`}
                                  className="hover:underline"
                                  children={months[Number(month)]}
                                />
                                &nbsp;
                                <Link
                                  to={`/years/${year}/months/${month}/days`}
                                  className="hover:underline"
                                  children={formatDay(Number(day) + 1)}
                                />
                                &nbsp;
                                <Link to="/years" className="hover:underline" children={year} />
                              </>
                            );
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "print/:year/:month",
        element: <PDFView />,
      },
      {
        path: "*",
        element: <Navigate to="/years" />,
      },
    ],
  },
]);
