import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { IconButton } from "../../../components/buttons/IconButton";
import { MarkdownEditor } from "../../../components/editors/markdown/MarkdownEditor";
import { Icon } from "../../../components/icons";
import { showNotification } from "../../../layouts/Toolbar";
import { dateToTimeValue, hoursToTimeValue, padTime, TimeValue, timeValueToHours } from "../../../utils/date.util";
import "./DayReport.scss";
import { DayColumn } from "./DayView";

export const DayReport: React.FC = () => {
  return <div children="DayReport" />;
};

// interface DayReportProps {}

// export const DayReport: React.FC<DayReportProps> = ({}) => {
//   const params = useParams();
//   const {
//     data: day,
//     error,
//     isLoading,
//     refetch,
//     handler: dayHandler,
//   } = useDayQuery(params.year!, params.month!, params.day!);

//   const updateMutation = useMutation(["day-update", params.year, params.month, params.day], dayHandler.update, {
//     onSuccess: () => refetch(),
//     onError: (error: any) => {
//       showNotification({
//         type: "success",
//         title: "Failed to update day",
//         description: error?.message,
//       });
//     },
//   });

//   const [editing, setEditing] = React.useState(false);
//   const [value, setValue] = React.useState(day?.report?.notes || "");

//   const icon = React.useMemo(() => {
//     return React.createElement(editing ? Icon.Save : Icon.Edit, {
//       height: 24,
//       ...(editing && { className: "text-lime-600" }),
//     });
//   }, [editing]);

//   const { startTime, endTime, suggestedHours } = React.useMemo(() => {
//     let minFrom: number | undefined = undefined;
//     let maxTo: number | undefined = undefined;

//     day?.workLogs.map((workLog) => {
//       const fromTime = new Date(workLog.from).getTime();
//       if (!minFrom || fromTime < minFrom) minFrom = fromTime;

//       if (workLog.to) {
//         const toTime = new Date(workLog.to).getTime();
//         if (!maxTo || toTime > maxTo) maxTo = toTime;
//       }
//     });

//     const suggestedTime = totalWorkLogTime(day?.workLogs || []);

//     return {
//       startTime: minFrom ? dateToTimeValue(new Date(minFrom)) : undefined,
//       endTime: maxTo ? dateToTimeValue(new Date(maxTo)) : undefined,
//       suggestedHours: `${padTime(suggestedTime.hours)}:${padTime(suggestedTime.minutes)}`,
//     };
//   }, [day]);

//   const handleUpdateEditing = (editing: boolean) => {
//     setEditing(editing);
//     if (!editing) {
//       updateMutation.mutate((day) => {
//         if (!day.report) day.report = { hours: 0, notes: "" };
//         day.report.notes = value;
//         return day;
//       });
//     }
//   };

//   React.useEffect(() => {
//     setValue(day?.report?.notes || "");
//   }, [day]);

//   return (
//     <DayColumn
//       title={
//         <div className="flex flex-row justify-between items-center">
//           <span children="Report" />
//           <IconButton
//             title={editing ? "Save note" : "Edit note"}
//             onClick={() => handleUpdateEditing(!editing)}
//             children={icon}
//           />
//         </div>
//       }
//       loading={isLoading}
//       error={error}
//     >
//       <div className="relative grid grid-rows-[min-content_1fr] gap-4 w-full h-full">
//         <div className="border border-zinc-300 p-4 flex flex-col gap-2 justify-between">
//           <div className="flex flex-row gap-4 justify-between">
//             <span className="font-medium text-lg uppercase">Start Time</span>
//             <span className="leading-[28px]" children={startTime} />
//           </div>

//           <div className="flex flex-row gap-4 justify-between">
//             <span className="font-medium text-lg uppercase">End Time</span>
//             <span className="leading-[28px]" children={endTime} />
//           </div>

//           <div className="flex flex-row gap-4 justify-between">
//             <span className="font-medium text-lg uppercase">Hours</span>
//             <input
//               type="time"
//               min="00:00"
//               max="24:00"
//               className="w-full text-end"
//               defaultValue={hoursToTimeValue(day?.report?.hours || 0)}
//               onChange={(e) => {
//                 updateMutation.mutate((day) => {
//                   if (!day.report) day.report = { hours: 0, notes: "" };
//                   day.report.hours = timeValueToHours(e.target.value as TimeValue);
//                   return day;
//                 });
//               }}
//             />
//             {suggestedHours && (
//               <span className="leading-[28px] text-zinc-500" title="Suggested hours" children={suggestedHours} />
//             )}
//           </div>
//         </div>

//         <div className="day-report-input overflow-y-scroll border border-zinc-300">
//           <MarkdownEditor
//             className="min-h-full w-full"
//             textareaClassName="min-h-full resize-none"
//             editing={editing}
//             value={value}
//             onChange={setValue}
//             setEditing={handleUpdateEditing}
//             placeholder="Note..."
//           />
//         </div>
//       </div>
//     </DayColumn>
//   );
// };
