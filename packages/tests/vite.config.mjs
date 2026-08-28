/// <reference types="vite-plus/test" />

import { fileURLToPath } from 'node:url'
import { defineConfig, lazyPlugins } from 'vite-plus'
import solidPlugin from '@solidjs/vite-plugin'
import { DOMElements, SVGElements } from '@solidjs/web'

const src = fileURLToPath(new URL('../solid-pixi/src/index.ts', import.meta.url))

export default defineConfig({
  plugins: lazyPlugins(() => [
    solidPlugin({
      solid: {
        moduleName: 'solid-pixi',
        generate: 'dynamic',
        renderers: [
          { name: 'dom', moduleName: '@solidjs/web', elements: [...DOMElements, ...SVGElements] }
        ]
      }
    })
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
