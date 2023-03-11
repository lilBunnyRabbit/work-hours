import React from "react";
import { PaperButton } from "../components/buttons/PaperButton";
import { useWFile } from "../utils/w-file/useWFile";

export const IndexView: React.FC = () => {
  const { open, create } = useWFile();

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
