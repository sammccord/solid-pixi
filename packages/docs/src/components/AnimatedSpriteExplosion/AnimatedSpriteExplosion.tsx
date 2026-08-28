import type { AnimatedSprite as PixiAnimatedSprite } from 'pixi.js'
import { createMemo } from 'solid-js'
import {
  Application,
  For,
  Loading,
  Stage,
  render,
  useApplication,
  useSpritesheet,
  AnimatedSprite
} from 'solid-pixi'

render(() => (
  <AnimatedSpriteExplosion canvas={document.getElementById('root')! as HTMLCanvasElement} />
))

function SwapContainer() {
  const app = useApplication()
  const sheet = useSpritesheet('https://pixijs.com/assets/spritesheet/mc.json')

  const frames = createMemo(() =>
    Array.from({ length: 26 }, (_, i) => sheet().textures[`Explosion_Sequence_A ${i + 1}.png`]!)
  )

  return (
    <Loading>
      <For each={Array.from({ length: 50 })}>
        {() => (
          <AnimatedSprite
            textures={frames()}
            x={Math.random() * app.screen.width}
            y={Math.random() * app.screen.height}
            anchor={{ x: 0.5, y: 0.5 }}
            rotation={Math.random() * Math.PI}
            autoUpdate
            scale={0.75 * Math.random() * 2}
            ref={(sprite: PixiAnimatedSprite) => sprite.gotoAndPlay((Math.random() * 26) | 0)}
          />
        )}
      </For>
    </Loading>
  )
}

function AnimatedSpriteExplosion(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
        <SwapContainer />
      </Stage>
    </Application>
  )
}
