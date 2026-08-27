/// <reference types="vite-plus/test" />
/// <reference types="vite-plus/client" />

import { defineConfig, lazyPlugins } from 'vite-plus'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: lazyPlugins(() => [solidPlugin()]),
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: './src/index.ts',
      name: 'SolidPIXI'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['solid-js', 'pixi-unsafe'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'solid-js': 'solid',
          'pixi-unsafe': 'PIXI'
        }
      }
    }
  }
})
