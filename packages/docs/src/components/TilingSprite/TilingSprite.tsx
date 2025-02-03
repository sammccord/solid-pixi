import { Texture } from 'pixi.js'
import {
  Application,
  Assets,
  For,
  P,
  Stage,
  Suspense,
  render,
  useApplication,
  useAsset
} from '../../../../solid-pixi/src/index'

render(() => <TilingSpriteExample canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function TilingSpriteContainer() {
  const app = useApplication()
  const texture = Texture.from('https://pixijs.com/assets/p2.jpeg')

  let count = 0

  return (
    <P.TilingSprite
      texture={texture}
      width={app!.screen.width}
      height={app!.screen.height}
      ref={tilingSprite => {
        app!.ticker.add(() => {
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

function TilingSpriteExample(props) {
  return (
    <Application resizeTo={window} canvas={props.canvas}>
      <Assets load={[['https://pixijs.com/assets/p2.jpeg']]}>
        <Stage>
          <TilingSpriteContainer />
        </Stage>
      </Assets>
    </Application>
  )
}
