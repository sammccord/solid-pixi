import type { PointLike } from 'pixi.js'
import { Application, Loading, Stage, render, useApplication, useAsset, Sprite } from 'solid-pixi'

render(() => (
  <TransparentBackground canvas={document.getElementById('root')! as HTMLCanvasElement} />
))

function BunniesContainer() {
  const app = useApplication()
  const texture = useAsset('https://pixijs.com/assets/bunny.png')

  return (
    <Loading>
      <Sprite
        texture={texture()}
        anchor={{ x: 0.5, y: 0.5 } as PointLike}
        x={app.screen.width / 2}
        y={app.screen.height / 2}
        ref={sprite => {
          app.ticker.add(() => {
            sprite.rotation += 0.01
          })
        }}
      />
    </Loading>
  )
}

function TransparentBackground(props) {
  return (
    <Application backgroundAlpha={0} resizeTo={window} canvas={props.canvas}>
      <Stage>
        <BunniesContainer />
      </Stage>
    </Application>
  )
}
