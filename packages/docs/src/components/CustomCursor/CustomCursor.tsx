import { Texture, type PointLike } from 'pixi.js'
import { Suspense, createSignal } from 'solid-js'
import { Application, Assets, Sprite, useApplication } from '../../../../solid-pixi/src/index'

function ClickContainer() {
  const app = useApplication()

  const defaultIcon = "url('https://v2-pixijs.com/assets/bunny.png'),auto"
  const hoverIcon = "url('https://v2-pixijs.com/assets/bunny_saturated.png'),auto"

  // Add custom cursor styles
  app.renderer.events.cursorStyles.default = defaultIcon
  app.renderer.events.cursorStyles.hover = hoverIcon

  return (
    <Sprite
      texture={Texture.from('https://v2-pixijs.com/assets/bunny.png')}
      interactive
      cursor={hoverIcon}
      scale={{ x: 3, y: 3 }}
      anchor={{ x: 0.5, y: 0.5 } as PointLike}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
    />
  )
}

export function CustomCursor() {
  return (
    <Application background="#1099bb" resizeTo={window}>
      <Assets
        load={[
          [
            'https://v2-pixijs.com/assets/bunny.png',
            'https://v2-pixijs.com/assets/bunny_saturated.png'
          ]
        ]}
      >
        <ClickContainer />
      </Assets>
    </Application>
  )
}
