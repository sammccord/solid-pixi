---
'solid-pixi': major
---

Replace the `P` namespace with named, tree-shakeable components.

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
