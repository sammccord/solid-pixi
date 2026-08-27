/// <reference types="vite-plus/test" />
/// <reference types="vite-plus/client" />

import { defineConfig, lazyPlugins } from "vite-plus";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: lazyPlugins(() => [solidPlugin()]),
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: "./src/index.ts",
      name: "SolidPIXI",
    },
    external: ["solid-js", "pixi.js"],
    globals: {
      "solid-js": "solid",
      "pixi.js": "PIXI",
    },
  },
});
