import { AnimatedSprite, type PointLike, Texture } from 'pixi.js'
import { createEffect, createMemo, createSignal } from 'solid-js'
import {
  Application,
  Assets,
  For,
  P,
  Show,
  Stage,
  Suspense,
  render,
  useApplication,
  useAsset
} from '../../../../solid-pixi/src/index'

render(() => (
  <AnimatedSpriteExplosion canvas={document.getElementById('root')! as HTMLCanvasElement} />
))

function SwapContainer() {
  const app = useApplication()
  const textures = Array.from({ length: 26 }).map((_, i) => {
    return Texture.from(`Explosion_Sequence_A ${i + 1}.png`)
  })

  return (
    <For each={Array.from({ length: 50 })}>
      {() => {
        const scale = 0.75 * Math.random() * 2
        const [ref, setRef] = createSignal<AnimatedSprite>()
        createEffect(() => {
          ref()?.gotoAndPlay((Math.random() * 26) | 0)
        })
        return (
          <P.AnimatedSprite
            textures={textures}
            x={Math.random() * app!.screen.width}
            y={Math.random() * app!.screen.height}
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={Math.random() * Math.PI}
            autoUpdate
            scale={scale}
            ref={setRef}
          />
        )
      }}
    </For>
  )
}

function AnimatedSpriteExplosion(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Assets load={[['https://pixijs.com/assets/spritesheet/mc.json']]}>
        <Stage>
          <SwapContainer />
        </Stage>
      </Assets>
    </Application>
  )
}
