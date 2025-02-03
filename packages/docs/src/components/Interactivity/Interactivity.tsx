import { type PointLike, Texture } from 'pixi.js'
import { createSignal } from 'solid-js'
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

render(() => <Interactivity canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function InteractivityContainer() {
  const app = useApplication()

  const textureButton = Texture.from('https://pixijs.com/assets/button.png')
  const textureButtonDown = Texture.from('https://pixijs.com/assets/button_down.png')
  const textureButtonOver = Texture.from('https://pixijs.com/assets/button_over.png')

  let isOver = false,
    isDown = false
  const [texture, setTexture] = createSignal(textureButton)

  return (
    <P.Sprite
      texture={texture()}
      interactive
      cursor="pointer"
      pointerdown={() => {
        isDown = true
        setTexture(textureButtonDown)
      }}
      pointerup={() => {
        isDown = false
        if (isOver) {
          setTexture(textureButtonOver)
        } else {
          setTexture(textureButton)
        }
      }}
      pointerupoutside={() => {
        isDown = false
        if (isOver) {
          setTexture(textureButtonOver)
        } else {
          setTexture(textureButton)
        }
      }}
      pointerover={() => {
        isOver = true
        if (isDown) {
          return
        }
        setTexture(textureButtonOver)
      }}
      pointerout={() => {
        isOver = false
        if (isDown) {
          return
        }
        setTexture(textureButton)
      }}
      anchor={{ x: 0.5, y: 0.5 } as PointLike}
      x={app!.screen.width / 2}
      y={app!.screen.height / 2}
    />
  )
}

export function Interactivity(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      {/* <Assets
        load={[
          [
            'https://pixijs.com/assets/button.png',
            'https://pixijs.com/assets/button_down.png',
            'https://pixijs.com/assets/button_over.png'
          ]
        ]}
      > */}
      <Stage>
        <InteractivityContainer />
      </Stage>
      {/* </Assets> */}
    </Application>
  )
}
