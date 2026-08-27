/// <reference types="vite-plus/test" />

import { fileURLToPath } from 'node:url'
import { defineConfig, lazyPlugins } from 'vite-plus'
import solidPlugin from '@solidjs/vite-plugin'

const src = fileURLToPath(new URL('../solid-pixi/src/index.ts', import.meta.url))

export default defineConfig({
  plugins: lazyPlugins(() => [
    solidPlugin({ solid: { moduleName: 'solid-pixi', generate: 'universal' } })
  ]),
  resolve: {
    alias: { 'solid-pixi': src },
    conditions: ['development', 'browser']
  },
  ssr: {
    noExternal: ['solid-js', 'pixi.js'],
    resolve: { conditions: ['development', 'browser'] }
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx']
  }
})
