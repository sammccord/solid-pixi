import { type PointLike, Texture } from 'pixi.js'
import { Show, createEffect, createSignal } from 'solid-js'
import { Application, P, Stage, render, useApplication, useAssets } from 'solid-pixi'

render(() => <TextureSwap canvas={document.getElementById('root')! as HTMLCanvasElement} />)

const _textures = [
  'https://pixijs.com/assets/flowerTop.png',
  'https://pixijs.com/assets/eggHead.png'
]

function SwapContainer() {
  const app = useApplication()
  const [textures] = useAssets(_textures)
  const [texture, setTexture] = createSignal(0)

  return (
    <Show when={textures()}>
      <P.Sprite
        texture={Texture.from(_textures[texture()]!)}
        interactive
        onpointerdown={() => {
          console.log(texture())
          setTexture(1 - texture())
        }}
        anchor={{ x: 0.5, y: 0.5 } as PointLike}
        x={app!.screen.width / 2}
        y={app!.screen.height / 2}
      />
    </Show>
  )
}

function TextureSwap(props) {
  return (
    <Application background='#1099bb' resizeTo={window} canvas={props.canvas}>
      <Stage>
        <SwapContainer />
      </Stage>
    </Application>
  )
}
