import React from "react";
import { classNames } from "../../utils/class.util";
import "./Print.scss";

const PrintDocument: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  React.useEffect(() => {
    document.body.classList.add("print");
    return () => {
      document.body.classList.remove("print");
    };
  }, []);

  return <div className={classNames("print-document", className)} {...props} />;
};

interface PrintPageProps {
  dynamic?: boolean;
}

const PrintPage: React.FC<Omit<React.ComponentProps<"div">, keyof PrintPageProps> & PrintPageProps> = ({
  dynamic,
  className,
  ...props
}) => {
  return <article className={classNames("print-page", className)} data-dynamic={dynamic} {...props} />;
};

export const Print = {
  Document: PrintDocument,
  Page: PrintPage,
};
