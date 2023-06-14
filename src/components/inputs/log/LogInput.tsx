import React from "react";
import { TimeValueStopwatch } from "../../../hooks/useStopwatch";
import { classNames } from "../../../utils/class.util";
import { TimeShortString, TimeValue } from "../../../utils/time.util";
import { WHFile } from "../../../wh-file/types/WHFileTypes";
import { IconButton } from "../../buttons/IconButton";
import { PaperButton } from "../../buttons/PaperButton";
import { MarkdownEditor } from "../../editors/markdown/MarkdownEditor";
import { Icon } from "../../icons";
import "./LogInput.scss";

interface LogInputProps {
  workLog: WHFile.Day["workLogs"][number];
  onDelete?: () => void;
  onChange?: (workLog: WHFile.Day["workLogs"][number]) => void;
}

export const LogInput: React.FC<LogInputProps> = ({ workLog, onDelete, onChange }) => {
  const [editing, setEditing] = React.useState<boolean>(false);
  const [deleting, setDeleting] = React.useState(false);

  const [note, setNote] = React.useState<string>(workLog.note || "");

  const { from, to } = React.useMemo(() => {
    return {
      from: workLog.from ? TimeValue.from(workLog.from) : TimeValue.now(),
      to: workLog.to ? TimeValue.from(workLog.to) : undefined,
    };
  }, [workLog]);

  const icon = React.useMemo(() => {
    return React.createElement(editing ? Icon.Save : Icon.Edit, {
      height: 20,
      ...(editing && { className: "text-lime-600" }),
    });
  }, [editing]);

  const handleChange = React.useCallback(
    (partial: Partial<typeof workLog>) => {
      if (!onChange) return;
      onChange({ ...workLog, ...partial });
    },
    [onChange, workLog]
  );

  const handleUpdateEditing = (editing: boolean) => {
    setEditing(editing);
    if (!editing) {
      handleChange({ note: note });
    }
  };

  const overlay = React.useMemo(() => {
    if (deleting) {
      return (
        <div className="grid grid-cols-[1fr_min-content_min-content] w-full h-full items-center gap-2">
          Delete log?
          <LogInputButton onClick={() => setDeleting(false)} children="Cancel" />
          <LogInputButton onClick={onDelete} variant="error" children="Delete" />
        </div>
      );
    }
  }, [deleting]);

  React.useEffect(() => {
    setNote(workLog.note || "");
  }, [workLog.note]);

  return (
    <div className="log-input relative flex flex-col w-full border border-zinc-300 bg-zinc-900">
      <div
        className={classNames(
          "grid grid-cols-[min-content_min-content_1fr_min-content] gap-4 w-full py-2 px-4 items-center",
          (editing || note) && "border-b border-b-zinc-300"
        )}
      >
        <input
          type="time"
          defaultValue={from?.toShortString() || ""}
          onChange={(e) => handleChange({ from: TimeValue.from(e.target.value as TimeShortString).toString() })}
        />

        {to ? (
          <input
            type="time"
            defaultValue={to?.toShortString() || ""}
            onChange={(e) => handleChange({ to: TimeValue.from(e.target.value as TimeShortString).toString() })}
          />
        ) : (
          <LogInputButton
            variant="success"
            onClick={() => handleChange({ to: TimeValue.now().toString() })}
            children="STOP"
          />
        )}

        <TimeValueStopwatch start={from} end={to} />

        <div className="flex flex-row items-center gap-2">
          <IconButton
            title={editing ? "Save note" : "Edit note"}
            onClick={() => handleUpdateEditing(!editing)}
            children={icon}
          />
          <IconButton title="Delete log" className="hover:text-red-600" onClick={() => setDeleting(true)}>
            <Icon.Trash height={20} />
          </IconButton>
        </div>
      </div>

      <MarkdownEditor
        value={note || ""}
        onChange={setNote}
        className="flex-1 bg-zinc-800"
        editing={editing}
        placeholder="Note..."
        setEditing={handleUpdateEditing}
      />

      {overlay && (
        <div className="absolute top-0 left-0 right-0 bottom-0 grid bg-inherit items-center px-4" children={overlay} />
      )}
    </div>
  );
};

const LogInputButton: React.FC<React.ComponentProps<typeof PaperButton>> = ({ className, ...props }) => {
  return <PaperButton className={classNames("p-0 h-[28px] w-[75.19px]", className)} {...props} />;
};
