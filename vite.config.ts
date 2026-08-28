import { defineConfig } from 'vite-plus'

// The docs site is still on the Solid 1 API surface, so it fails the type-aware
// gate wholesale. Delete this list once its Solid 2 migration lands and the
// docs join `vp check` with everything else.
const DOCS_UNTIL_SOLID_2 = ['packages/docs/**', 'pnpm-lock.yaml']

export default defineConfig({
  fmt: {
    printWidth: 100,
    tabWidth: 2,
    singleQuote: true,
    jsxSingleQuote: false,
    semi: false,
    trailingComma: 'none',
    arrowParens: 'avoid',
    quoteProps: 'as-needed',
    endOfLine: 'lf',
    sortPackageJson: true,
    ignorePatterns: DOCS_UNTIL_SOLID_2
  },
  lint: {
    ignorePatterns: DOCS_UNTIL_SOLID_2,
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        // createRenderer returns an object of standalone closures, so
        // destructuring them loses no `this`.
        files: ['packages/solid-pixi/src/runtime.tsx'],
        rules: { 'typescript/unbound-method': 'off' }
      },
      {
        files: ['packages/tests/browser/**'],
        rules: { 'typescript/restrict-template-expressions': 'off' }
      }
    ]
  }
})
