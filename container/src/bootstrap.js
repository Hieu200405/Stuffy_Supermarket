import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from "./App";

// Sentry.init({
//   dsn: "https://your-dsn-here@o0.ingest.sentry.io/0", // Replace with real Sentry DSN
//   integrations: [new BrowserTracing()],
//   tracesSampleRate: 1.0, // Monitor everything in development
// });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);