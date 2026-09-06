import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@src": path.resolve(import.meta.dirname, "./src") },
  },
  build: {
    rollupOptions: { external: ["js7z-tools", "innoextract-wasm", "electron"] },
  },
  worker: {
    rollupOptions: { external: ["js7z-tools", "innoextract-wasm", "electron"] },
  },
});
