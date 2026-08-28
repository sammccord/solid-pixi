/// <reference types="vite-plus/client" />

import { fileURLToPath } from 'node:url'
import solidPlugin from '@solidjs/vite-plugin'
import { defineConfig, lazyPlugins } from 'vite-plus'

// The universal codegen emits imports from `moduleName`, so the library's own
// JSX imports the renderer by package name. Point that back at the source.
const runtime = fileURLToPath(new URL('./src/runtime.tsx', import.meta.url))

export default defineConfig({
  plugins: lazyPlugins(() => [
    solidPlugin({ solid: { moduleName: 'solid-pixi', generate: 'universal' } })
  ]),
  resolve: {
    alias: { 'solid-pixi': runtime }
  },
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rolldownOptions: {
      external: ['solid-js', '@solidjs/universal', 'pixi.js']
    }
  }
})
