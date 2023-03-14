import React, { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { WHFileProvider } from "./utils/wh-file/WHFileProvider";

let fileHandle;

async function getFile() {
  // open file picker
  [fileHandle] = await (window as any).showOpenFilePicker();

  if (fileHandle.kind === "file") {
    // run file code
    const file = await fileHandle.getFile();
    const contents = await file.text();

    console.log({ file, contents });
  } else if (fileHandle.kind === "directory") {
    // run directory code
  }
}

export default function App() {
  const [count, setCount] = useState(0);

  React.useEffect(() => {}, []);

  return (
    <WHFileProvider>
      <RouterProvider router={router} />
    </WHFileProvider>
  );
}