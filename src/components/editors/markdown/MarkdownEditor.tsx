import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ghcolors } from "react-syntax-highlighter/dist/esm/styles/prism";
import { classNames } from "../../../utils/class.util";
import "./MarkdownEditor.scss";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;

  editing?: boolean;
  className?: string;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, className, editing, placeholder }) => {
  const ref = React.useRef<HTMLTextAreaElement>();

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "0px";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value, editing]);

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
    </div>
  );
};
