import { Texture } from 'pixi.js'
import { Application, Assets, TilingSprite, useApplication } from '../../../../solid-pixi/src/index'

function TilingSpriteContainer() {
  const app = useApplication()
  const texture = Texture.from('https://pixijs.com/assets/p2.jpeg')

  let count = 0

  return (
    <TilingSprite
      texture={texture}
      width={app!.screen.width}
      height={app!.screen.height}
      ref={tilingSprite => {
        app.ticker.add(() => {
          count += 0.005

          tilingSprite.tileScale.x = 2 + Math.sin(count)
          tilingSprite.tileScale.y = 2 + Math.cos(count)

          tilingSprite.tilePosition.x += 1
          tilingSprite.tilePosition.y += 1
        })
      }}
    />
  )
}

export function Example() {
  return (
    <Application resizeTo={window}>
      <Assets load={[['https://pixijs.com/assets/p2.jpeg']]}>
        <TilingSpriteContainer />
      </Assets>
    </Application>
  )
}
