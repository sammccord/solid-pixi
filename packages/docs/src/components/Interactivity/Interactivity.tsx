import { type PointLike, Texture } from 'pixi.js'
import { Show, createSignal } from 'solid-js'
import {
  Application,
  For,
  P,
  Stage,
  Suspense,
  render,
  useApplication,
  useAssets
} from '../../../../solid-pixi/src/index'

render(() => <Interactivity canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function InteractivityContainer() {
  const app = useApplication()
  const [textures] = useAssets<{
    'https://pixijs.com/assets/button.png': Texture
    'https://pixijs.com/assets/button_down.png': Texture
    'https://pixijs.com/assets/button_over.png': Texture
  }>([
    'https://pixijs.com/assets/button.png',
    'https://pixijs.com/assets/button_down.png',
    'https://pixijs.com/assets/button_over.png'
  ])

  let isOver = false,
    isDown = false
  const [texture, setTexture] = createSignal('https://pixijs.com/assets/button.png')

  return (
    <Show when={textures()}>
      <P.Sprite
        texture={Texture.from(texture())}
        interactive
        cursor='pointer'
        onpointerdown={() => {
          isDown = true
          setTexture('https://pixijs.com/assets/button_down.png')
        }}
        onpointerup={() => {
          isDown = false
          if (isOver) {
            setTexture('https://pixijs.com/assets/button_over.png')
          } else {
            setTexture('https://pixijs.com/assets/button.png')
          }
        }}
        onpointerupoutside={() => {
          isDown = false
          if (isOver) {
            setTexture('https://pixijs.com/assets/button_over.png')
          } else {
            setTexture('https://pixijs.com/assets/button.png')
          }
        }}
        onpointerover={() => {
          isOver = true
          if (isDown) {
            return
          }
          setTexture('https://pixijs.com/assets/button_over.png')
        }}
        onpointerout={() => {
          isOver = false
          if (isDown) {
            return
          }
          setTexture('https://pixijs.com/assets/button.png')
        }}
        anchor={{ x: 0.5, y: 0.5 } as PointLike}
        x={app!.screen.width / 2}
        y={app!.screen.height / 2}
      />
    </Show>
  )
}

function Interactivity(props) {
  return (
    <Application background='#1099bb' resizeTo={window} canvas={props.canvas}>
      <Stage>
        <InteractivityContainer />
      </Stage>
    </Application>
  )
}
