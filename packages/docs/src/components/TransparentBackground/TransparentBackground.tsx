import { type PointLike, Texture } from 'pixi.js'
import { Suspense } from 'solid-js'
import { Application, Assets, Sprite, useApplication } from '../../../../solid-pixi/src/index'

function BunniesContainer() {
  const app = useApplication()
  const texture = Texture.from('https://pixijs.com/assets/bunny.png')

  return (
    <Sprite
      texture={texture}
      anchor={{ x: 0.5, y: 0.5 } as PointLike}
      x={app!.screen.width / 2}
      y={app!.screen.height / 2}
      uses={[
        sprite => {
          app!.ticker.add(delta => {
            sprite.rotation += 0.01
          })
        }
      ]}
    />
  )
}

export function TransparentBackground() {
  return (
    <Application backgroundAlpha={0} resizeTo={window}>
      <Assets load={[['https://pixijs.com/assets/bunny.png']]}>
        <BunniesContainer />
      </Assets>
    </Application>
  )
}
