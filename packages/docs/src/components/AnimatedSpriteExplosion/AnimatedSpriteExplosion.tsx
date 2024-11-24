import { type PointLike, Texture } from 'pixi.js'
import { For, Suspense } from 'solid-js'
import {
  AnimatedSprite,
  Application,
  Assets,
  useApplication
} from '../../../../solid-pixi/src/index'

function SwapContainer() {
  const app = useApplication()
  const textures = Array.from({ length: 26 }).map((_, i) => {
    return Texture.from(`Explosion_Sequence_A ${i + 1}.png`)
  })

  return (
    <For each={Array.from({ length: 50 })}>
      {() => {
        const scale = 0.75 * Math.random() * 2
        return (
          <AnimatedSprite
            textures={textures}
            x={Math.random() * app.screen.width}
            y={Math.random() * app.screen.height}
            anchor={{ x: 0.5, y: 0.5 } as PointLike}
            rotation={Math.random() * Math.PI}
            scale={{ x: scale, y: scale }}
            uses={ref => ref.gotoAndPlay((Math.random() * 26) | 0)}
          />
        )
      }}
    </For>
  )
}

export function AnimatedSpriteExplosion() {
  return (
    <Application background="#1099bb" resizeTo={window}>
      <Assets load={[['https://pixijs.com/assets/spritesheet/mc.json']]}>
        <SwapContainer />
      </Assets>
    </Application>
  )
}
