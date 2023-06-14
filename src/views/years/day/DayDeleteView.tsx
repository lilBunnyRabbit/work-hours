import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../../components/Loader";
import { showNotification } from "../../../layouts/Toolbar";
import { classNames } from "../../../utils/class.util";

export const DayDeleteView: React.FC = () => {
  return <div children="DayDeleteView" />;
};

// export const DayDeleteView: React.FC = () => {
//   const params = useParams();
//   const navigate = useNavigate();

//   const dayHandler = useDay(params.year!, params.month!, params.day!);

//   const { error, mutate: deleteDay } = useMutation(
//     ["day-delete", params.year, params.month, params.day],
//     dayHandler.remove,
//     {
//       onSuccess: () => {
//         showNotification({
//           type: "success",
//           title: "Deleted day",
//         });

//         navigate(`/years/${params.year}/months/${params.month}/days`);
//       },
//       onError: (error: any) => {
//         showNotification({
//           type: "error",
//           title: "Failed to delete day",
//           description: error?.message,
//         });

//         navigate(`/years/${params.year}/months/${params.month}/days/${params.day}`);
//       },
//     }
//   );

//   React.useEffect(() => {
//     setTimeout(deleteDay, 500);
//   }, []);

//   return (
//     <div className="flex w-full h-full justify-center items-center absolute top-0 left-0 bottom-0 right-0 z-50 bg-[rgba(24,24,27,0.5)]">
//       <Loader size="xl" className={classNames(error && "text-red-600")} />
//     </div>
//   );
// };
