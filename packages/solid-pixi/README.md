# solid-pixi

Build [Pixi.js](https://pixijs.com) scenes with [Solid](https://solidjs.com) JSX and signals.

Version 3 requires Solid 2. For Solid 1, use `solid-pixi@2`.

## Install

```sh
npm install solid-pixi solid-js pixi.js
```

## Project setup

solid-pixi is a Solid _universal_ renderer, so your JSX has to be compiled for
it rather than for the DOM. Compile with `@solidjs/vite-plugin` and point the
JSX factory at `solid-pixi`, which ships its own JSX types.

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

A file that mixes pixi and DOM JSX needs a per-file
`/** @jsxImportSource solid-pixi */` pragma.

## Usage

```tsx
import { createSignal } from 'solid-js'
import { Application, P, Stage, render, useApplication, useAsset } from 'solid-pixi'

render(() => <Scene canvas={document.getElementById('root') as HTMLCanvasElement} />)

function Scene(props: { canvas: HTMLCanvasElement }) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
        <Bunny />
      </Stage>
    </Application>
  )
}

function Bunny() {
  const app = useApplication()
  const texture = useAsset('https://pixijs.com/assets/bunny.png')
  const [scale, setScale] = createSignal(1)

  return (
    <Errored fallback={error => <P.Text text={String(error())} />}>
      <Loading fallback={<P.Text text={`${Math.round(texture.progress() * 100)}%`} />}>
        <P.Sprite
          texture={texture()}
          anchor={0.5}
          scale={scale()}
          x={app!.screen.width / 2}
          y={app!.screen.height / 2}
          eventMode="static"
          onClick={() => setScale(s => s + 0.1)}
        />
      </Loading>
    </Errored>
  )
}
```

Writes are staged. Solid 2 commits on the next microtask, so imperative code
that reads a pixi property straight after a setter needs `flush()`.

## Docs

- [Guides and live examples](https://sammccord.github.io/solid-pixi)
- [Example sources](https://github.com/sammccord/solid-pixi/tree/main/packages/docs/src/components)

## License

MIT
