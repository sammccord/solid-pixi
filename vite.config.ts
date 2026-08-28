import { defineConfig } from 'vite-plus'

// The docs sources still fail the type-aware lint gate wholesale (implicit-any
// params and unresolved JSX runtimes under their loose tsconfig). They are
// formatted by `vp fmt` but not lint-checked; delete the lint exclusion once
// the docs tsconfig is tightened up.
const DOCS_LINT_ONLY = ['packages/docs/**', 'pnpm-lock.yaml']

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
    ignorePatterns: ['pnpm-lock.yaml']
  },
  lint: {
    ignorePatterns: DOCS_LINT_ONLY,
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
