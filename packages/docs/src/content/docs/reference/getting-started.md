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

A file that mixes pixi and DOM JSX needs dynamic codegen; see
[Usage within a Solid.js DOM application](#usage-within-a-solidjs-dom-application).

## A first scene

```tsx
import { Texture } from 'pixi.js'
import { createSignal } from 'solid-js'
import { Application, Sprite, Stage, render } from 'solid-pixi'

render(() => <App canvas={document.getElementById('canvas')! as HTMLCanvasElement} />)

export function App(props) {
  const [x, setX] = createSignal(10)

  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
        <Sprite
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
import { Errored, Loading, Sprite, Text, useAsset } from 'solid-pixi'
import { refresh } from 'solid-js'

function Bunny() {
  const texture = useAsset('https://pixijs.com/assets/bunny.png')

  return (
    <Errored fallback={error => <Text text={String(error())} />}>
      <Loading fallback={<Text text={`${Math.round(texture.progress() * 100)}%`} />}>
        <Sprite texture={texture()} />
      </Loading>
    </Errored>
  )
}
```

`refresh(texture)` reloads it and `isPending(() => texture())` reports an in-flight
reload.

## Two things Solid 2 changes

**Writes are staged.** Setters commit on the next microtask, so imperative code that
reads a pixi property straight after a write needs `flush()`. Per-frame work goes
through `useTick`, which runs its callback inside `flush` so the write lands on the
frame that made it instead of a frame late:

```tsx
useTick(() => {
  setDudes(draft => {
    for (const dude of draft) dude.x += dude.speed
  })
})
```

A callback added to `app.ticker` by hand still has to wrap its own writes in `flush()`.

**Refs run detached from the owner.** That is what makes `ref={setSignal}` legal, and
it means a ref callback cannot read an async accessor. Capture the settled value
outside the callback:

```tsx
<Show when={texture()} keyed>
  {value => <Graphics ref={g => g.stroke({ texture: value, width: 10 })} />}
</Show>
```

## Usage within a Solid.js DOM application

Dynamic codegen compiles both renderers in one project. Tags in the `elements` list become
DOM templates and everything else becomes a `solid-pixi` component call, so one JSX tree can
hold a DOM panel and a pixi scene.

```js
// vite.config.js
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

An `<Application>` with no `canvas` prop creates its own canvas, and that canvas is what the
component renders. A DOM parent mounts it like any other child.

```tsx
/** @jsxImportSource @solidjs/web */
import { render } from '@solidjs/web'
import { createSignal } from 'solid-js'
import { Application, Graphics, Stage } from 'solid-pixi'

function App() {
  const [hot, setHot] = createSignal(true)

  return (
    <div>
      <span>{hot() ? 'red' : 'blue'}</span>
      <button onClick={() => setHot(value => !value)}>toggle</button>
      <Application background="#1099bb" width={320} height={320}>
        <Stage>
          <Graphics
            tint={hot() ? 0xff0000 : 0x0000ff}
            ref={g => g.rect(0, 0, 320, 320).fill(0xffffff)}
          />
        </Stage>
      </Application>
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
```

One signal drives the DOM text and the pixi fill. Pass a `canvas` prop instead and the
element stays where you put it. `<Application>` then renders nothing of its own.

TypeScript needs `jsxImportSource` pointed at `@solidjs/web` for a file like this, through
either the per-file pragma above or `tsconfig.json`. `solid-pixi` declares no intrinsic tags,
so `<div>` does not typecheck under its JSX namespace. The pragma is a TypeScript setting
only. The plugin config decides how the file compiles.

A project whose JSX is all pixi keeps `generate: 'universal'` and needs no renderer override.
