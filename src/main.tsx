"use client";

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Main App component
import "./globals.css"; // Tailwind global styles

// Ensure environment variables exist using Vite's import.meta.env
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are missing! Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.");
}

// Root container
const container = document.getElementById("root");
if (!container) throw new Error("Root element with id 'root' not found");

// Create React root
const root = createRoot(container);

// Optional: Simple Error Boundary
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setErrorMsg(event.message);
      console.error(event.error);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="p-10 text-red-700 font-bold">
        Something went wrong: {errorMsg}
      </div>
    );
  }

  return <>{children}</>;
};

// Render App
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);