import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ghcolors } from "react-syntax-highlighter/dist/esm/styles/prism";
import { classNames } from "../../../utils/class.util";
import { isUndefined } from "../../../utils/type.util";
import { IconButton } from "../../buttons/IconButton";
import { Icon } from "../../icons";
import "./MarkdownEditor.scss";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;

  editing?: boolean;
  className?: string;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  className,
  editing: initialEditing,
  placeholder,
}) => {
  const [editing, setEditing] = React.useState<boolean>(() => (isUndefined(initialEditing) ? true : initialEditing));

  const icon = React.useMemo(() => {
    return React.createElement(editing ? Icon.FileText : Icon.Edit, { height: 24 });
  }, [editing]);

  React.useEffect(() => {
    if (!isUndefined(initialEditing)) {
      setEditing(initialEditing);
    }
  }, [initialEditing]);

  return (
    <div
      className={classNames(
        "relative flex text-zinc-300 bg-zinc-900",
        isUndefined(initialEditing) && "min-h-[40px]",
        className
      )}
    >
      <div className="relative flex flex-1 overflow-y-hidden">
        <textarea
          placeholder={placeholder}
          key={`markdown-editor-textarea`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={1}
          className={classNames(
            "w-full h-full p-4 outline-none text-inherit bg-inherit overflow-y-scroll placeholder:text-zinc-500",
            isUndefined(initialEditing) && "min-h-[40px]",
            !editing && "hidden"
          )}
        />

        {!editing && value && (
          <div className="w-full h-full p-4 bg-inherit">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, "")}
                      style={ghcolors as any}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
              children={value}
            />
          </div>
        )}
      </div>

      {isUndefined(initialEditing) && (
        <IconButton className="absolute top-2 right-6" onClick={() => setEditing(!editing)} children={icon} />
      )}
    </div>
  );
};
