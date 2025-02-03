import { type PointLike, Texture } from 'pixi.js'
import { createSignal } from 'solid-js'
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

render(() => <Click canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function ClickContainer() {
  const app = useApplication()
  const [scale, setScale] = createSignal(1)

  return (
    <P.Sprite
      texture={Texture.from('https://pixijs.com/assets/bunny.png')}
      interactive
      onpointerdown={() => {
        setScale(s => s * 1.25)
      }}
      scale={{ x: scale(), y: scale() }}
      anchor={{ x: 0.5, y: 0.5 } as PointLike}
      x={app!.screen.width / 2}
      y={app!.screen.height / 2}
    />
  )
}

function Click(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
        <Assets load={[['https://pixijs.com/assets/bunny.png']]}>
          <ClickContainer />
        </Assets>
      </Stage>
    </Application>
  )
}
