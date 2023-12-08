import { Texture, type PointLike } from 'pixi.js'
import { Suspense, createSignal } from 'solid-js'
import { Application, Assets, Sprite, useApplication } from '../../../../solid-pixi/src/index'

function InteractivityContainer() {
  const app = useApplication()

  const textureButton = Texture.from('https://v2-pixijs.com/assets/button.png')
  const textureButtonDown = Texture.from('https://v2-pixijs.com/assets/button_down.png')
  const textureButtonOver = Texture.from('https://v2-pixijs.com/assets/button_over.png')

  let isOver = false,
    isDown = false
  const [texture, setTexture] = createSignal(textureButton)

  return (
    <Sprite
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
      x={app.screen.width / 2}
      y={app.screen.height / 2}
    />
  )
}

export function Interactivity() {
  return (
    <Application background="#1099bb" resizeTo={window}>
      <Assets
        load={[
          [
            'https://v2-pixijs.com/assets/button.png',
            'https://v2-pixijs.com/assets/button_down.png',
            'https://v2-pixijs.com/assets/button_over.png'
          ]
        ]}
      >
        <InteractivityContainer />
      </Assets>
    </Application>
  )
}
