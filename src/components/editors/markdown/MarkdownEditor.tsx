import React from "react";
import { classNames } from "../../../utils/class.util";
import { Markdown } from "../../markdown/Markdown";
import "./MarkdownEditor.scss";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;

  editing?: boolean;
  setEditing?: (editing: boolean) => void;
  className?: string;
  placeholder?: string;
  resizable?: boolean;

  textareaClassName?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  className,
  editing,
  setEditing,
  placeholder,
  textareaClassName,
}) => {
  const ref = React.useRef<HTMLTextAreaElement>();

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "0px";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value, editing]);

  React.useEffect(() => {
    if (!setEditing || !ref.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key.toLowerCase() === "s") || e.key === "Escape") {
        e.preventDefault();
        return setEditing(false);
      }
    };

    if (editing) {
      ref.current.addEventListener("keydown", handleKeyDown);
    } else {
      ref.current.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (!ref.current) return;
      ref.current.removeEventListener("keydown", handleKeyDown);
    };
  }, [editing, setEditing]);

  return (
    <div className={classNames("relative flex text-zinc-300 bg-zinc-900", className)}>
      <div className="relative flex flex-1 overflow-y-hidden">
        <textarea
          ref={ref as any}
          placeholder={placeholder}
          key={`markdown-editor-textarea`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={1}
          className={classNames(
            "w-full min-h-[56px] p-4 outline-none text-inherit bg-inherit overflow-y-hidden placeholder:text-zinc-500",
            !editing && "hidden",
            textareaClassName
          )}
        />

        {!editing && value && (
          <div className="w-full h-full p-4 bg-inherit">
            <Markdown children={value} />
          </div>
        )}
      </div>
    </div>
  );
};
