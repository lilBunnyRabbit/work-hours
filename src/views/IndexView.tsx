import React from "react";
import { Navigate } from "react-router-dom";
import { PaperButton } from "../components/buttons/PaperButton";
import { useWHFile } from "../utils/wh-file/useWHFile";

export const IndexView: React.FC = () => {
  const { open, create, whFile } = useWHFile();

  if (whFile) {
    return <Navigate to="/years" />;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-6 w-full h-screen">
      <h1 className="font-normal">
        <u className="font-medium">Open</u> or <u className="font-medium">Create</u> project
      </h1>

      <div className="flex flex-row gap-4">
        <PaperButton className="w-[24vw] text-lg" onClick={open} children="Open" />
        <PaperButton className="w-[24vw] text-lg" onClick={create} children="Create" />
      </div>
    </div>
  );
};
