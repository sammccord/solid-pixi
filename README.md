![](./packages/docs/assets/logo.png)

Create Pixi.js experiences using JSX and Signals

## Install

```sh
npm install --save solid-pixi solid-js pixi.js
```

## Basic Usage

- [Basic Examples](https://sammccord.github.io/solid-pixi/guides/basic/assets/)
- [Examples Source](./packages/docs/src/components/)

```tsx
import { Texture, type PointLike } from 'pixi.js'
import { createSignal } from 'solid-js'
import { Application, Assets, Sprite, useApplication } from 'solid-pixi'

function ClickContainer() {
  const app = useApplication()
  const [scale, setScale] = createSignal(1)

  return (
    <Sprite
      texture={Texture.from('https://v2-pixijs.com/assets/bunny.png')}
      interactive
      pointerdown={() => {
        setScale(s => s * 1.25)
      }}
      scale={{ x: scale(), y: scale() }}
      anchor={{ x: 0.5, y: 0.5 } as PointLike}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
    />
  )
}

export function Click() {
  return (
    <Application background="#1099bb" resizeTo={window}>
      <Assets load={[['https://v2-pixijs.com/assets/bunny.png']]}>
        <ClickContainer />
      </Assets>
    </Application>
  )
}
```

## Contributing

Sure, go ahead and fork.

`solid-pixi` is a `pnpm` monorepo so run `pnpm install` from the root of the workspace.

Source code can be found in `/packages`, with the main published package in `/packages/solid-pixi`

### Developing

`cd packages/docs && npm run dev` will run the example page to quickly iterate on components
