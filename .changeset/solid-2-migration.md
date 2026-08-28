---
'solid-pixi': major
---

Require Solid 2. `solid-pixi` 3 peers on `solid-js@^2.0.0-rc.3` and builds on
`@solidjs/universal`.

**Project setup.** Compile with `@solidjs/vite-plugin` instead of
`vite-plugin-solid`, and point JSX at `solid-pixi`, which now owns its own JSX
types:

```js
import solid from '@solidjs/vite-plugin'

export default {
  plugins: [solid({ solid: { moduleName: 'solid-pixi', generate: 'universal' } })]
}
```

```json
{ "compilerOptions": { "jsx": "preserve", "jsxImportSource": "solid-pixi" } }
```

Files that mix pixi and DOM JSX compile with `generate: 'dynamic'` and a DOM
renderer override; the `jsxImportSource` pragma is a TypeScript setting only
and does not change what the plugin compiles.

**Control flow.** `Suspense`, `ErrorBoundary`, `SuspenseList`, and `Index` are
gone. Use `Loading`, `Errored`, `Reveal`, and `<For keyed={false}>`. `Repeat` is
new. All are re-exported from `solid-pixi` as before.

**Asset hooks.** `useAsset`, `useAssets`, `useSpritesheet`, and `useBundle` no
longer return `[resource, actions]`. Each returns the async accessor itself with
`progress` attached:

```tsx
const texture = useAsset('/hero.png')

<Errored fallback={err => <Oops error={err()} />}>
  <Loading fallback={<Bar value={texture.progress()} />}>
    <Sprite texture={texture()} />
  </Loading>
</Errored>
```

`refetch` becomes `refresh(texture)`, and `mutate` is gone; wrap the accessor in
`createSignal(() => texture())` if you need a local override. `resource.loading`
and `resource.error` become the `Loading` and `Errored` boundaries, or
`isPending(() => texture())` for an in-flight reload. The options argument is now
`MemoOptions`, where `loadingValue: Texture.EMPTY` replaces `initialValue`.

`useAssetInit` takes plain options rather than an accessor, because pixi ignores
a second `Assets.init`.

**Writes are staged.** Solid 2 commits on the next microtask, so imperative code
that reads a pixi property straight after a setter needs `flush()`.

**Fixes.** Text nodes no longer use the deprecated `new Text(value)` form, and
the text-node check no longer depends on `constructor.name` surviving
minification.
