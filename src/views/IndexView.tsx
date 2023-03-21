import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { PaperButton } from "../components/buttons/PaperButton";
import { useWHFile } from "../wh-file/useWHFile";

export const IndexView: React.FC = () => {
  const { open, create, handler: whFile } = useWHFile();
  const { state } = useLocation();

  if (whFile) {
    return <Navigate to={state?.location?.pathname || "/years"} />;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-6 w-full h-screen">
      <h1 className="font-normal">
        <u className="font-medium">Open</u> or <u className="font-medium">Create</u> project
      </h1>

      <div className="flex flex-row gap-4 w-full max-w-[640px]">
        <PaperButton className="w-full text-lg" onClick={open} children="Open" />
        <PaperButton className="w-full text-lg" onClick={create} children="Create" />
      </div>
    </div>
  );
};
