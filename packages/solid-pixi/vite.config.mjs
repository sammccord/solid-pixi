/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { resolve } from "path";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.tsx"),
      name: "SolidPIXI",
      // the proper extensions will be added
      fileName: "index",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["solid-js", "pixi.js"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          "solid-js": "solid",
          "pixi.js": "PIXI",
        },
      },
    },
  },
});
