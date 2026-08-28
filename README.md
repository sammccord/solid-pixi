![](./packages/docs/src/assets/logo.webp)

Create Pixi.js experiences using JSX and Signals

## Install

```sh
npm install solid-pixi solid-js pixi.js
```

Version 3 requires Solid 2. For Solid 1, use `solid-pixi@2`. Setup, the full API
and every example live in [`packages/solid-pixi/README.md`](./packages/solid-pixi/README.md)
and the [docs site](https://sammccord.github.io/solid-pixi).

## Basic Usage

- [Basic Examples](https://sammccord.github.io/solid-pixi/guides/basic/assets/)
- [Examples Source](./packages/docs/src/components/)

```tsx
import { createSignal } from 'solid-js'
import {
  Application,
  Loading,
  Sprite,
  Stage,
  Text,
  render,
  useApplication,
  useAsset
} from 'solid-pixi'

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
  const texture = useAsset('https://pixijs.com/assets/bunny.png')
  const [scale, setScale] = createSignal(1)

  return (
    <Loading fallback={<Text text="loading" />}>
      <Sprite
        texture={texture()}
        interactive
        onpointerdown={() => {
          setScale(s => s * 1.25)
        }}
        scale={{ x: scale(), y: scale() }}
        anchor={{ x: 0.5, y: 0.5 }}
        x={app!.screen.width / 2}
        y={app!.screen.height / 2}
      />
    </Loading>
  )
}
```

## Contributing

Sure, go ahead and fork.

`solid-pixi` is a `pnpm` monorepo so run `pnpm install` from the root of the workspace.

Source code can be found in `/packages`, with the main published package in `/packages/solid-pixi`

### Developing

`pnpm --filter docs dev` will run the example page to quickly iterate on components
