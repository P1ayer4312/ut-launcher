import { scan } from "react-scan";
import React from "react"; // Needed for React Scan
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.scss";
import Blank from "./blank/Blank.jsx";

scan({ enabled: import.meta.env?.DEV ?? false });

const queryClient = new QueryClient();

if (import.meta.env?.VITE_BLANK == "true") {
	createRoot(document.getElementById("root")).render(
		<StrictMode>
			<Blank />
		</StrictMode>,
	);
} else {
	createRoot(document.getElementById("root")).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</StrictMode>,
	);
}
