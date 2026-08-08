import { scan } from "react-scan";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import App from "./App";
import contextBridge from "@src/frontend/contextBridge/contextBridge";

scan({ enabled: Boolean(contextBridge.actionsHandler.isDev()) });

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
