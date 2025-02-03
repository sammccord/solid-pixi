import { type PointLike, Texture } from 'pixi.js'
import { createEffect, createSignal } from 'solid-js'
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

render(() => <CustomCursor canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function ClickContainer() {
  const app = useApplication()

  const defaultIcon = "url('https://pixijs.com/assets/bunny.png'),auto"
  const hoverIcon = "url('https://pixijs.com/assets/bunny_saturated.png'),auto"

  // Add custom cursor styles
  createEffect(() => {
    app!.renderer.events.cursorStyles.default = defaultIcon
    app!.renderer.events.cursorStyles.hover = hoverIcon
  })

  return (
    <P.Sprite
      texture={Texture.from('https://pixijs.com/assets/bunny.png')}
      interactive
      cursor={hoverIcon}
      scale={{ x: 3, y: 3 }}
      anchor={{ x: 0.5, y: 0.5 } as PointLike}
      x={app!.screen.width / 2}
      y={app!.screen.height / 2}
    />
  )
}

function CustomCursor(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Assets
        load={[
          ['https://pixijs.com/assets/bunny.png', 'https://pixijs.com/assets/bunny_saturated.png']
        ]}
      >
        <Stage>
          <ClickContainer />
        </Stage>
      </Assets>
    </Application>
  )
}
