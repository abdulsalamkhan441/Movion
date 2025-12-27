import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Make sure Vite copies everything from /public into /dist
  publicDir: "public",

  server: {
    port: 5173,
    strictPort: true,
    host: "localhost",
    hmr: { protocol: "ws", host: "localhost" },

    // Dev-only backend proxy
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
