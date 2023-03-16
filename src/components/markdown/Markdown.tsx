import React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./Markdown.scss";

interface MarkdownProps {
  theme?: "light" | "dark";
  children: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ theme = "dark", children }) => {
  return (
    <ReactMarkdown
      className="markdown"
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              style={theme === "dark" ? (darcula as any) : oneLight}
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
      children={children}
    />
  );
};
