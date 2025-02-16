![](./packages/docs/src/assets/logo.png)

Create Pixi.js experiences using JSX and Signals

## Install

```sh
npm install --save solid-pixi solid-js pixi.js
```

If you need to execute code in environments that don't support `new Function`, use `solid-pixi-unsafe` instead.

`npm install --save pixi-unsafe solid-js solid-pixi-unsafe`

## Basic Usage

- [Basic Examples](https://sammccord.github.io/solid-pixi/guides/basic/assets/)
- [Examples Source](./packages/docs/src/components/)

```tsx
import { Texture } from 'pixi.js'
import { createSignal, Suspense } from 'solid-js'
import { render, Application, useAsset, P, useApplication } from 'solid-pixi'

render(() => <Click canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function Click(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
        <ClickContainer />
      </Stage>
    </Application>
  )
}

function ClickContainer() {
  const app = useApplication()
  const [texture] = useAsset('https://pixijs.com/assets/bunny.png')
  const [scale, setScale] = createSignal(1)

  return (
    <Suspense>
      <P.Sprite
        texture={texture()}
        interactive
        onpointerdown={() => {
          setScale(s => s * 1.25)
        }}
        scale={{ x: scale(), y: scale() }}
        anchor={{ x: 0.5, y: 0.5 } as PointLike}
        x={app.screen.width / 2}
        y={app.screen.height / 2}
      />
    </Suspense>
  )
}
```

## Contributing

Sure, go ahead and fork.

`solid-pixi` is a `pnpm` monorepo so run `pnpm install` from the root of the workspace.

Source code can be found in `/packages`, with the main published package in `/packages/solid-pixi`

### Developing

`cd packages/docs && npm run dev` will run the example page to quickly iterate on components
