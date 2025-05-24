import { Texture } from 'pixi.js'
import { Application, For, P, Stage, Suspense, render, useApplication, useAsset } from 'solid-pixi'

render(() => <TilingSpriteExample canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function TilingSpriteContainer() {
  const app = useApplication()
  const [texture] = useAsset('https://pixijs.com/assets/p2.jpeg')

  let count = 0

  return (
    <Suspense>
      <P.TilingSprite
        texture={texture()}
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
    </Suspense>
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
