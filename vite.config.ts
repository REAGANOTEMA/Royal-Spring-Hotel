import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Vite configuration for React + TypeScript + Render deployment
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // allows import from "@/components/..."
    },
  },
  base: "./", // important for relative paths on Render
});