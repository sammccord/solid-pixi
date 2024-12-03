/// <reference types="vitest" />
/// <reference types="vite/client" />

import fs from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

const files = fs.readdirSync(resolve(__dirname, 'src'))
const packageJsonPath = resolve(__dirname, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString())

function writeExports() {
  return {
    name: 'writeExports',
    closeBundle() {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    }
  }
}

export default defineConfig({
  plugins: [solidPlugin(), writeExports()],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: files.map(f => resolve(__dirname, `src/${f}`)),
      name: 'SolidPIXI',
      // the proper extensions will be added
      fileName: (module, name) => {
        const outPath = `${name}${module === 'es' ? '.mjs' : '.umd.js'}`
        const exp = name.startsWith('index') ? '.' : `./${name}`
        if (!packageJson.exports[exp]) packageJson.exports[exp] = {}
        packageJson.exports[exp][module === 'es' ? 'import' : 'require'] = `./dist/${outPath}`
        packageJson.exports[exp]['types'] = `./dist/${name}.d.ts`
        return outPath
      }
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['solid-js', 'pixi.js'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          'solid-js': 'solid',
          'pixi.js': 'PIXI'
        }
      }
    }
  }
})
