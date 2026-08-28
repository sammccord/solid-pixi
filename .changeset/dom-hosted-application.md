---
'solid-pixi': major
---

Render a pixi scene inside a Solid DOM tree.

`<Application>` and `<Stage>` both returned `app.stage`, so a pixi tree was a
value only the pixi renderer could mount. `<Stage>` now renders nothing.
`<Application>` renders the canvas when it created one and renders nothing when
the caller passed `canvas`, so whichever side owns the canvas decides where it
goes.

With `generate: 'dynamic'` and a DOM renderer override, one file compiles for
both renderers, and a DOM parent mounts the canvas like any other child:

```js
import solid from '@solidjs/vite-plugin'
import { DOMElements, SVGElements } from '@solidjs/web'

export default {
  plugins: [
    solid({
      solid: {
        moduleName: 'solid-pixi',
        generate: 'dynamic',
        renderers: [
          {
            name: 'dom',
            moduleName: '@solidjs/web',
            elements: [...DOMElements, ...SVGElements]
          }
        ]
      }
    })
  ]
}
```

```tsx
<div id="hud">
  <span>{label()}</span>
  <Application background="#1099bb" width={320} height={320}>
    <Stage>
      <Graphics tint={tint()} ref={g => g.rect(0, 0, 320, 320).fill(0xffffff)} />
    </Stage>
  </Application>
</div>
```

The renderer only touches `Container` instances now, so an `<Application>` that
made its own canvas is inert under a pixi parent instead of crashing
`addChild`.

Code that used the return of `<Application>` or `<Stage>` as a container reads
`useApplication().stage` instead.
