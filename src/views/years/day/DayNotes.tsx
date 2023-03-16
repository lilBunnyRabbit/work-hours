import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { IconButton } from "../../../components/buttons/IconButton";
import { MarkdownEditor } from "../../../components/editors/markdown/MarkdownEditor";
import { Icon } from "../../../components/icons";
import { showNotification } from "../../../layouts/Toolbar";
import { useDayQuery } from "../../../utils/wh-file/WHFileQueries";
import "./DayNotes.scss";
import { DayColumn } from "./DayView";

export const DayNotes: React.FC = () => {
  const params = useParams();
  const {
    data: day,
    error,
    isLoading,
    refetch,
    handler: dayHandler,
  } = useDayQuery(params.year!, params.month!, params.day!);

  const updateMutation = useMutation(["day-update", params.year, params.month, params.day], dayHandler.update, {
    onSuccess: () => refetch(),
    onError: (error: any) => {
      showNotification({
        type: "success",
        title: "Failed to update day",
        description: error?.message,
      });
    },
  });

  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(day?.notes || "");

  const icon = React.useMemo(() => {
    return React.createElement(editing ? Icon.Save : Icon.Edit, {
      height: 24,
      ...(editing && { className: "text-lime-600" }),
    });
  }, [editing]);

  const handleUpdateEditing = (editing: boolean) => {
    setEditing(editing);
    if (!editing) {
      updateMutation.mutate((day) => {
        day.notes = value;
        return day;
      });
    }
  };

  React.useEffect(() => {
    setValue(day?.notes || "");
  }, [day]);

  return (
    <DayColumn
      title={
        <div className="flex flex-row justify-between items-center">
          <span children="Notes" />
          <IconButton
            title={editing ? "Save note" : "Edit note"}
            onClick={() => handleUpdateEditing(!editing)}
            children={icon}
          />
        </div>
      }
      loading={isLoading}
      error={error}
    >
      <div className="day-note-input w-full h-full max-h-full overflow-y-scroll border border-zinc-300">
        <MarkdownEditor
          className="min-h-full w-full"
          textareaClassName="min-h-full resize-none"
          editing={editing}
          value={value}
          onChange={setValue}
          setEditing={handleUpdateEditing}
          placeholder="Note..."
        />
      </div>
    </DayColumn>
  );
};
