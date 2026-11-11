import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const SUPABASE_FUNCTIONS_URL = process.env.VITE_SUPABASE_URL || "http://127.0.0.1:54321";

// The development proxy mirrors the /api routing configured for Vercel.
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: SUPABASE_FUNCTIONS_URL,
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/api/, "/functions/v1"),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
