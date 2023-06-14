import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { WHFileProvider } from "./wh-file/context/WHFileContext";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WHFileProvider>
        <RouterProvider router={router} />
      </WHFileProvider>
    </QueryClientProvider>
  );
}
