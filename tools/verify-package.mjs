#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = fileURLToPath(new URL('..', import.meta.url))
const pkgDir = join(repo, 'packages/solid-pixi')
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'))
const work = join(tmpdir(), 'solid-pixi-verify')
const fixture = join(work, 'consumer')

// attw counts a problem toward its exit code even when the profile already
// ignores the resolution that raised it, so the node10-only rules have to be
// named here too. node10 predates `exports`, and nothing that can compile
// solid-pixi JSX resolves that way. `cjs-resolves-to-esm` is ignored for the
// same reason the package is ESM-only: authoring solid-pixi JSX needs the Solid
// compiler, so every consumer runs a bundler and none of them `require`.
// The `consumer typecheck (node16)` stage below is the real check on the
// property `internal-resolution-error` would have covered, and it is stricter:
// it caught the extensionless `.d.ts` imports by running tsc, not by heuristic.
const attwProfile = process.env.ATTW_PROFILE ?? 'node16'
const attwIgnored = ['cjs-resolves-to-esm', 'internal-resolution-error', 'no-resolution']
const results = []

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: 'pipe', ...opts })
}

function stage(name, fn) {
  try {
    const detail = fn()
    results.push({ name, ok: true, detail })
    console.log(`PASS  ${name}${detail ? `  (${detail})` : ''}`)
    return true
  } catch (error) {
    const detail = [error.stdout, error.stderr, error.message].filter(Boolean).join('\n').trim()
    results.push({ name, ok: false, detail })
    console.log(`FAIL  ${name}\n${detail.replace(/^/gm, '        ')}`)
    return false
  }
}

rmSync(work, { recursive: true, force: true })
mkdirSync(fixture, { recursive: true })

stage('build', () => {
  run('pnpm', ['--filter', pkg.name, 'run', 'build'], { cwd: repo })
  return 'dist rebuilt from source'
})

let tarball
stage('pack', () => {
  const out = run('pnpm', ['pack', '--pack-destination', work], { cwd: pkgDir })
  const name = out.trim().split('\n').pop()
  tarball = isAbsolute(name) ? name : join(work, name)
  const files = run('tar', ['-tzf', tarball]).trim().split('\n').length
  return `${files} files`
})

stage('publint', () => {
  run('npx', ['--yes', 'publint@0.3.24', tarball, '--strict'], { cwd: work })
  return 'no errors, no warnings, no suggestions'
})

stage(`attw --profile ${attwProfile}`, () => {
  run(
    'npx',
    [
      '--yes',
      '@arethetypeswrong/cli@0.18.5',
      tarball,
      '--profile',
      attwProfile,
      '--ignore-rules',
      ...attwIgnored
    ],
    { cwd: work }
  )
  return 'every export resolves to matching types and runtime'
})

const peer = pkg.peerDependencies ?? {}
const dev = pkg.devDependencies ?? {}

writeFileSync(
  join(fixture, 'package.json'),
  `${JSON.stringify(
    {
      name: 'solid-pixi-consumer',
      private: true,
      type: 'module',
      dependencies: {
        'solid-pixi': `file:${tarball}`,
        'solid-js': peer['solid-js'],
        'pixi.js': peer['pixi.js'],
        '@solidjs/vite-plugin': dev['@solidjs/vite-plugin'],
        typescript: '^5.7.3',
        vite: '^7.1.5'
      }
    },
    null,
    2
  )}\n`
)

const tsconfig = (module, moduleResolution) => ({
  compilerOptions: {
    target: 'es2022',
    lib: ['es2022', 'dom'],
    module,
    moduleResolution,
    jsx: 'preserve',
    jsxImportSource: 'solid-pixi',
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    types: []
  },
  include: ['src']
})

writeFileSync(
  join(fixture, 'tsconfig.json'),
  `${JSON.stringify(tsconfig('ESNext', 'Bundler'), null, 2)}\n`
)
writeFileSync(
  join(fixture, 'tsconfig.node16.json'),
  `${JSON.stringify(tsconfig('Node16', 'Node16'), null, 2)}\n`
)

writeFileSync(join(fixture, 'pnpm-workspace.yaml'), 'allowBuilds:\n  esbuild: true\n')

writeFileSync(
  join(fixture, 'vite.config.mjs'),
  `import solid from '@solidjs/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [solid({ solid: { moduleName: 'solid-pixi', generate: 'universal' } })],
  build: { ssr: 'src/main.tsx', outDir: 'out', target: 'node22' },
  ssr: {
    noExternal: ['solid-js', 'pixi.js', 'solid-pixi'],
    resolve: { conditions: ['development', 'browser'] }
  },
  resolve: { conditions: ['development', 'browser'] }
})
`
)

mkdirSync(join(fixture, 'src'), { recursive: true })
writeFileSync(
  join(fixture, 'src/main.tsx'),
  `import { Container as PixiContainer, type Sprite as PixiSprite } from 'pixi.js'
import { createSignal, flush } from 'solid-js'
import { Container, For, Sprite, render } from 'solid-pixi'

const root = new PixiContainer()
const [x, setX] = createSignal(0)
const [labels, setLabels] = createSignal(['a', 'b'])

const dispose = (render as (code: () => unknown, node: PixiContainer) => () => void)(
  () => (
    <Container label="scene">
      <Sprite x={x()} label="hero" />
      <For each={labels()}>{label => <Sprite label={label} />}</For>
    </Container>
  ),
  root
)

const scene = root.children[0] as PixiContainer
const hero = scene.children[0] as PixiSprite

const assert = (name: string, ok: boolean, detail?: unknown) => {
  if (!ok) throw new Error(\`\${name}: \${JSON.stringify(detail)}\`)
}

assert('mounted', scene.label === 'scene' && hero.label === 'hero', scene.label)
assert('static prop applied', hero.x === 0, hero.x)

setX(9)
assert('write is staged until flush', hero.x === 0, hero.x)
flush()
assert('write lands after flush', hero.x === 9, hero.x)

setLabels(['a', 'b', 'c'])
flush()
assert(
  'For appended a child',
  scene.children.map(child => child.label).join(',') === 'hero,a,b,c',
  scene.children.map(child => child.label)
)

dispose()
console.log('consumer scene graph ok')
`
)

stage('consumer install', () => {
  run('pnpm', ['install', '--no-frozen-lockfile'], { cwd: fixture })
  return 'tarball installed as a real dependency'
})

stage('consumer typecheck (bundler)', () => {
  run('npx', ['tsc', '--noEmit'], { cwd: fixture })
  return 'jsxImportSource: solid-pixi resolves, named component props type-check'
})

stage('consumer typecheck (node16)', () => {
  run('npx', ['tsc', '-p', 'tsconfig.node16.json'], { cwd: fixture })
  return 'types resolve for a plain Node ESM consumer, not just a bundler'
})

stage('consumer build', () => {
  run('npx', ['vite', 'build'], { cwd: fixture })
  return '@solidjs/vite-plugin universal codegen resolves the runtime exports'
})

stage('consumer run', () => {
  const out = run('node', ['out/main.js'], { cwd: fixture })
  if (!out.includes('consumer scene graph ok')) throw new Error(out)
  return 'renders, stages writes, reconciles For'
})

const failed = results.filter(result => !result.ok)
console.log(`\n${results.length - failed.length}/${results.length} stages passed`)
console.log(`fixture: ${fixture}`)
process.exit(failed.length === 0 ? 0 : 1)
