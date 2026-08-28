---
title: Getting Started
description: Start using solid-pixi
---

## Install

```sh
npm install --save pixi.js solid-js solid-pixi
```

`solid-pixi` 3 requires Solid 2. `pixi.js` and `solid-js` are peers.

If you need to run in an environment without `new Function`, use `solid-pixi-unsafe`
with `pixi-unsafe` instead.

## Configure the compiler

`solid-pixi` is a custom Solid renderer, so it owns its own JSX types and needs the
universal codegen rather than the DOM one.

```js
// vite.config.js
import solid from '@solidjs/vite-plugin'

export default {
  plugins: [solid({ solid: { moduleName: 'solid-pixi', generate: 'universal' } })]
}
```

```json
// tsconfig.json
{ "compilerOptions": { "jsx": "preserve", "jsxImportSource": "solid-pixi" } }
```

A file that mixes pixi and DOM JSX needs a per-file pragma:

```tsx
/** @jsxImportSource solid-pixi */
```

## A first scene

```tsx
import { Texture } from 'pixi.js'
import { createSignal } from 'solid-js'
import { Application, P, Stage, render } from 'solid-pixi'

render(() => <App canvas={document.getElementById('canvas')! as HTMLCanvasElement} />)

export function App(props) {
  const [x, setX] = createSignal(10)

  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
        <P.Sprite
          x={x()}
          interactive
          onpointerdown={() => setX(value => value * 2)}
          texture={Texture.from('url')}
        />
      </Stage>
    </Application>
  )
}
```

## Loading assets

Asset hooks return an async accessor. Read it inside a `<Loading>` boundary, which
renders its fallback until the load settles, and put failures in `<Errored>`.

```tsx
import { Errored, Loading, P, useAsset } from 'solid-pixi'
import { refresh } from 'solid-js'

function Bunny() {
  const texture = useAsset('https://pixijs.com/assets/bunny.png')

  return (
    <Errored fallback={error => <P.Text text={String(error())} />}>
      <Loading fallback={<P.Text text={`${Math.round(texture.progress() * 100)}%`} />}>
        <P.Sprite texture={texture()} />
      </Loading>
    </Errored>
  )
}
```

`refresh(texture)` reloads it and `isPending(() => texture())` reports an in-flight
reload.

## Two things Solid 2 changes

**Writes are staged.** Setters commit on the next microtask, so imperative code that
reads a pixi property straight after a write needs `flush()`. This matters most inside
a ticker callback, which would otherwise land its write a frame late:

```tsx
app.ticker.add(() => {
  flush(() => {
    setDudes(draft => {
      for (const dude of draft) dude.x += dude.speed
    })
  })
})
```

**Refs run detached from the owner.** That is what makes `ref={setSignal}` legal, and
it means a ref callback cannot read an async accessor. Capture the settled value
outside the callback:

```tsx
<Show when={texture()} keyed>
  {value => <P.Graphics ref={g => g.stroke({ texture: value, width: 10 })} />}
</Show>
```

## Usage within a Solid.js DOM application

`solid-pixi` renders to pixi, not the DOM, so mount it from a DOM component with its
own `render` call.

```tsx
import { onSettled } from 'solid-js'
import { Application, Stage, render } from 'solid-pixi'

function App() {
  let canvas!: HTMLCanvasElement

  onSettled(() => {
    const dispose = render(() => <PixiApp canvas={canvas} />)
    return dispose
  })

  return <canvas ref={canvas} />
}

function PixiApp(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage />
    </Application>
  )
}
```
