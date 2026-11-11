import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const SUPABASE_FUNCTIONS_URL = "https://qrrziayuzfdfvkptywgt.supabase.co";

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
