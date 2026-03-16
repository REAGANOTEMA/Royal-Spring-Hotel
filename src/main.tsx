"use client";

import React from "react";
import { createRoot } from "react-dom/client"; // React 18+ root API
import App from "./App"; // Main App component
import "./globals.css"; // Tailwind global styles

// Get the root element
const container = document.getElementById("root");
if (!container) throw new Error("Root element with id 'root' not found");

// Create React root
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);