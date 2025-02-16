---
title: Getting Started
description: Start using solid-pixi
---

Install `solid-pixi`

`npm install --save pixi.js solid-js solid-pixi`

If you need to execute code in environments that don't support `new Function`, use `solid-pixi-unsafe` instead.

`npm install --save pixi-unsafe solid-js solid-pixi-unsafe`

The library has no dependencies, but requires `pixi.js` and `solid-js` as a peers.

And in your application:

```tsx
import { Application, Stage, P } from 'solid-pixi'
import { createSignal } from 'solid-js'

export function App() {
  const [x, setX] = createSignal(10)
  return <Application>
    <Stage>
      <P.Sprite x={x()} interactive onpointerdown={() => setX(_x => x * 2)} texture={Texture.from('url')} />
    </Stage>
  </Application>
}
```
