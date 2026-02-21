import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "src",
  publicDir: path.resolve(__dirname, "src/assets"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@repo/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "src/popup/index.html"),
        background: path.resolve(__dirname, "src/background/index.ts"),
        content: path.resolve(__dirname, "src/content/index.ts"),
      },
      output: {
        entryFileNames: "[name]/index.js",
        assetFileNames: "[name]/[name].[ext]",
      },
    },
  },
});
