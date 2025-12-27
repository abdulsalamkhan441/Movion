import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // This ensures Vite copies everything from /public into /dist
  publicDir: "public",

  build: {
    rollupOptions: {
      output: {
        // Prevent Vite from rewriting or removing unknown files
        assetFileNames: "[name].[ext]",
      },
    },
  },

  server: {
    port: 5173,
    strictPort: true,
    host: "localhost",
    hmr: { protocol: "ws", host: "localhost" },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
