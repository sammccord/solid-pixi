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
import { Application, Stage, P, render } from 'solid-pixi'
import { createSignal } from 'solid-js'

render(() => <App canvas={document.getElementById('canvas')! as HTMLCanvasElement} />)

export function App(props) {
  const [x, setX] = createSignal(10)
  return (
    <Application background='#1099bb' resizeTo={window} canvas={props.canvas}>
      <Stage>
        <P.Sprite x={x()} interactive onpointerdown={() => setX(_x => x * 2)} texture={Texture.from('url')} />
      </Stage>
    </Application>
  )
}
```

## Usage within Solid.js application

```tsx
import { Application, Stage, render } from 'solid-pixi'
import { onMount } from 'solid-js'

function App() {
  const canvas = <canvas />

  onMount(() => {
    render(() => <PixiApp canvas={canvas} />)
  })

  return canvas
}

function PixiApp(props) {
  <Application background='#1099bb' resizeTo={window} canvas={props.canvas}>
    <Stage />
  </Application>
}

```
