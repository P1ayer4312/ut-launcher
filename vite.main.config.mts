import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@src": path.resolve(__dirname, "./src") },
  },
  build: {
    rollupOptions: { external: ["js7z-tools", "innoextract-wasm"] },
  },
  worker: {
    rollupOptions: { external: ["js7z-tools", "innoextract-wasm"] },
  },
});
