import { type PointLike, Texture } from 'pixi.js'
import {
  Application,
  For,
  P,
  Stage,
  Suspense,
  render,
  useApplication,
  useAsset
} from '../../../../solid-pixi/src/index'

render(() => (
  <TransparentBackground canvas={document.getElementById('root')! as HTMLCanvasElement} />
))

function BunniesContainer() {
  const app = useApplication()
  const texture = Texture.from('https://pixijs.com/assets/bunny.png')

  return (
    <P.Sprite
      texture={texture}
      anchor={{ x: 0.5, y: 0.5 } as PointLike}
      x={app!.screen.width / 2}
      y={app!.screen.height / 2}
      ref={sprite => {
        app!.ticker.add(() => {
          sprite.rotation += 0.01
        })
      }}
    />
  )
}

function TransparentBackground(props) {
  return (
    <Application backgroundAlpha={0} resizeTo={window} canvas={props.canvas}>
      <Assets load={[['https://pixijs.com/assets/bunny.png']]}>
        <Stage>
          <BunniesContainer />
        </Stage>
      </Assets>
    </Application>
  )
}
