import { type PointLike, Texture, Assets as pxAssets } from 'pixi.js'
import { createEffect } from 'solid-js'
import {
  Application,
  Assets,
  For,
  P,
  SpriteSheet,
  Stage,
  Suspense,
  render,
  useApplication,
  useAsset,
  useSpritesheet
} from '../../../../solid-pixi/src/index'

render(() => <Spritesheet canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function SwapContainer() {
  const app = useApplication()
  const spritesheet = useSpritesheet()

  return (
    <For each={Array.from({ length: 50 })}>
      {() => {
        const scale = 0.75 * Math.random() * 2
        return (
          <P.Sprite
            texture={spritesheet.textures[`Explosion_Sequence_A ${10}.png`]}
            x={Math.random() * app!.screen.width}
            y={Math.random() * app!.screen.height}
            anchor={{ x: 0.5, y: 0.5 } as PointLike}
            rotation={Math.random() * Math.PI}
            scale={{ x: scale, y: scale }}
          />
        )
      }}
    </For>
  )
}

function Spritesheet(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Assets
        load={[
          [
            'https://pixijs.com/assets/spritesheet/mc.png',
            'https://pixijs.com/assets/spritesheet/mc.json'
          ]
        ]}
      >
        <SpriteSheet
          texture={Texture.from('https://pixijs.com/assets/spritesheet/mc.png')}
          data={pxAssets.get('https://pixijs.com/assets/spritesheet/mc.json').data}
        >
          <Stage>
            <SwapContainer />
          </Stage>
        </SpriteSheet>
      </Assets>
    </Application>
  )
}
