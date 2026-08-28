import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const src = fileURLToPath(new URL('../../solid-pixi/src', import.meta.url))

const REMOVED_PATHS = [
  'solid-js/universal',
  'solid-js/web',
  'solid-js/store',
  'solid-js/h',
  'solid-js/html',
  'solid-js/jsx-runtime',
  'solid-js/jsx-dev-runtime'
]

const REMOVED_EXPORTS = [
  'createResource',
  'Resource',
  'ResourceActions',
  'ResourceOptions',
  'ResourceReturn',
  'splitProps',
  'mergeProps',
  'batch',
  'on',
  'onMount',
  'onError',
  'catchError',
  'createComputed',
  'createDeferred',
  'createMutable',
  'modifyMutable',
  'createSelector',
  'produce',
  'unwrap',
  'indexArray',
  'observable',
  'from',
  'startTransition',
  'useTransition',
  'resetErrorBoundaries',
  'Suspense',
  'SuspenseList',
  'ErrorBoundary',
  'Index',
  'JSXElement'
]

const IMPORT = /import\s+(type\s+)?(?:([\s\S]*?)\s+from\s+)?['"]([^'"]+)['"]/g

function namedImports(clause: string): string[] {
  const open = clause.indexOf('{')
  const close = clause.lastIndexOf('}')
  if (open === -1 || close < open) return []
  return clause
    .slice(open + 1, close)
    .split(',')
    .map(part =>
      part
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0]!
        .trim()
    )
    .filter(Boolean)
}

const files = readdirSync(src)
  .filter(name => name.endsWith('.ts') || name.endsWith('.tsx'))
  .map(name => [name, readFileSync(join(src, name), 'utf8')] as const)

test('the source files are found', () => {
  expect(files.length).toBeGreaterThan(0)
})

test.each(files)('%s imports no removed solid-js path', (_name, source) => {
  const specifiers = [...source.matchAll(IMPORT)].map(match => match[3] ?? '')
  expect(specifiers.filter(s => REMOVED_PATHS.includes(s))).toEqual([])
})

test.each(files)('%s imports no removed solid-js export', (_name, source) => {
  const found = new Set<string>()
  for (const [, , clause, specifier] of source.matchAll(IMPORT)) {
    if (specifier !== 'solid-js' || !clause) continue
    for (const name of namedImports(clause)) {
      if (REMOVED_EXPORTS.includes(name)) found.add(name)
    }
  }
  expect([...found]).toEqual([])
})

test.each(files)('%s uses the context component, not Context.Provider', (_name, source) => {
  expect(source).not.toMatch(/\.Provider\b/)
})
