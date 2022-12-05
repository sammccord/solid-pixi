/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "solid-pixi": path.resolve(__dirname, "../solid-pixi/src/index.tsx"),
    },
  },
  plugins: [solidPlugin()],
});
