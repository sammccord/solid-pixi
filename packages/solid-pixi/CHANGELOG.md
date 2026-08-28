# solid-pixi

## 3.0.0-next.0

### Major Changes

- 03b37ff: Destroy nodes that control flow removes.

  A `<Show>` or `<For>` exit used to detach its nodes and leave them alive, so a
  scene that churned through them accumulated undestroyed Text textures and
  Graphics contexts for as long as the app ran. Removal now destroys the removed
  subtree bottom-up. `destroy()` is called with no options, so a node frees the
  resources it owns and the textures it merely borrows are left alone.

  Instances adopted through `as` are exempt. The scene did not create them, so it
  detaches them and never destroys them. `render()`'s dispose is unchanged as
  well, leaving the mounted tree attached and undestroyed.

  Code that pulled a node out of the tree and kept using it has to own that node
  itself now, by constructing it and passing it in through `as`.

- 8135d3f: Render a pixi scene inside a Solid DOM tree.

  `<Application>` and `<Stage>` both returned `app.stage`, so a pixi tree was a
  value only the pixi renderer could mount. `<Stage>` now renders nothing.
  `<Application>` renders the canvas when it created one and renders nothing when
  the caller passed `canvas`, so whichever side owns the canvas decides where it
  goes.

  With `generate: 'dynamic'` and a DOM renderer override, one file compiles for
  both renderers, and a DOM parent mounts the canvas like any other child:

  ```js
  import solid from "@solidjs/vite-plugin";
  import { DOMElements, SVGElements } from "@solidjs/web";

  export default {
    plugins: [
      solid({
        solid: {
          moduleName: "solid-pixi",
          generate: "dynamic",
          renderers: [
            {
              name: "dom",
              moduleName: "@solidjs/web",
              elements: [...DOMElements, ...SVGElements],
            },
          ],
        },
      }),
    ],
  };
  ```

  ```tsx
  <div id="hud">
    <span>{label()}</span>
    <Application background="#1099bb" width={320} height={320}>
      <Stage>
        <Graphics
          tint={tint()}
          ref={(g) => g.rect(0, 0, 320, 320).fill(0xffffff)}
        />
      </Stage>
    </Application>
  </div>
  ```

  The renderer only touches `Container` instances now, so an `<Application>` that
  made its own canvas is inert under a pixi parent instead of crashing
  `addChild`.

  Code that used the return of `<Application>` or `<Stage>` as a container reads
  `useApplication().stage` instead.

- c2f34ff: Replace the `P` namespace with named, tree-shakeable components.

  The `P` Proxy resolved pixi classes by name at runtime
  (`new pixi[name](options)`), which forced bundlers to retain the entire
  pixi.js namespace. Every wrapped class is now a named export built from a
  static factory, so a bundle only carries the pixi features a scene uses. In
  esbuild measurements of a one-container app, eager JavaScript drops from
  226 KB to 111 KB gzipped.

  ```diff
  -import { Application, P, Stage, render } from 'solid-pixi'
  +import { Application, Sprite, Stage, render } from 'solid-pixi'

  -<P.Sprite texture={texture()} />
  +<Sprite texture={texture()} />
  ```

  Components keep the exact `P.*` runtime semantics, including `as`, `ref`, and
  `children`. Files that import the same class from both packages need an alias:
  `import { Sprite as PixiSprite } from 'pixi.js'`.

  `createElement` throws again for string tags. Scenes are built from the named
  components; there are no intrinsic elements to construct by name, and the
  dynamic lookup was the other half of the tree-shaking leak.

- 04a67b0: Require Solid 2. `solid-pixi` 3 peers on `solid-js@^2.0.0-rc.3` and builds on
  `@solidjs/universal`.

  **Project setup.** Compile with `@solidjs/vite-plugin` instead of
  `vite-plugin-solid`, and point JSX at `solid-pixi`, which now owns its own JSX
  types:

  ```js
  import solid from "@solidjs/vite-plugin";

  export default {
    plugins: [
      solid({ solid: { moduleName: "solid-pixi", generate: "universal" } }),
    ],
  };
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

- 03b37ff: `useApplication` no longer returns `undefined`.

  It was typed `PixiApplication | undefined` because there was nothing to hand
  back outside an `<Application>`, which pushed a `!` or a `?.` onto every call
  site for a case none of them could do anything about. It now returns
  `PixiApplication` and throws `useApplication must be called under
<Application>` when the context is missing.

  ```diff
  -<Sprite x={app!.screen.width / 2} y={app!.screen.height / 2} />
  +<Sprite x={app.screen.width / 2} y={app.screen.height / 2} />
  ```

  Callers delete their `!` and `?.`. A component that reaches for the app is
  either inside an `<Application>` or is a bug, and the error says which.

### Minor Changes

- 03b37ff: Add `useTick`, which runs a callback on the application's ticker for the life
  of the component.

  The callback runs inside `flush`, so the signal and store writes it makes
  commit on the frame that made them rather than a frame late. That is the whole
  reason to reach for it over `app.ticker.add`, which leaves the flush to the
  caller.

  ```diff
  -app.ticker.add(() => {
  -  flush(() => setCount(c => c + 0.1))
  -})
  +useTick(() => setCount(c => c + 0.1))
  ```

  The listener is added on mount with `priority` when one is given, and removed
  on cleanup. An `enabled` accessor attaches and detaches it as the value flips,
  which is how a scene pauses per-frame work without tearing the component down:

  ```tsx
  useTick(spin, { priority: UPDATE_PRIORITY.HIGH, enabled: () => !paused() });
  ```

  `useTick` calls `useApplication`, so it belongs in component setup under an
  `<Application>`.

## 2.0.0

### Major Changes

- 6878331: refactor to use solid's unversal rendering for perf and simplicity

### Patch Changes

- 232e5cf: potential hot loading solution
- f29d589: useSpritesheet, useBundle, useAssetInit, some jsdoc, genericize hooks

## 2.0.0-next.1

### Patch Changes

- 232e5cf: potential hot loading solution
- f29d589: useSpritesheet, useBundle, useAssetInit, some jsdoc, genericize hooks

## 2.0.0-next.0

### Major Changes

- 6878331: refactor to use solid's unversal rendering for perf and simplicity

## 1.0.0

### Major Changes

- 8d1412b: initial release, use ref instead of uses to be more in line with solid conventions
