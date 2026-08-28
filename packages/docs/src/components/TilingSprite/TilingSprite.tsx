import type { TilingSprite as PixiTilingSprite } from 'pixi.js'
import {
  Application,
  Stage,
  Loading,
  render,
  useApplication,
  useAsset,
  useTick,
  TilingSprite
} from 'solid-pixi'

render(() => <TilingSpriteExample canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function TilingSpriteContainer() {
  const app = useApplication()
  const texture = useAsset('https://pixijs.com/assets/p2.jpeg')

  let count = 0
  let tilingSprite: PixiTilingSprite | undefined

  useTick(() => {
    if (!tilingSprite) return

    count += 0.005

    tilingSprite.tileScale.x = 2 + Math.sin(count)
    tilingSprite.tileScale.y = 2 + Math.cos(count)

    tilingSprite.tilePosition.x += 1
    tilingSprite.tilePosition.y += 1
  })

  return (
    <Loading>
      <TilingSprite
        texture={texture()}
        width={app.screen.width}
        height={app.screen.height}
        ref={node => (tilingSprite = node)}
      />
    </Loading>
  )
}

function TilingSpriteExample(props) {
  return (
    <Application resizeTo={window} canvas={props.canvas}>
      <Stage>
        <TilingSpriteContainer />
      </Stage>
    </Application>
  )
}
