import { Texture, type PointLike } from 'pixi.js'
import { createSignal } from 'solid-js'
import { Application, Assets, Sprite, useApplication } from '../../../../solid-pixi/src/index'

function ClickContainer() {
  const app = useApplication()
  const [scale, setScale] = createSignal(1)

  return (
    <Sprite
      texture={Texture.from('https://v2-pixijs.com/assets/bunny.png')}
      interactive
      pointerdown={() => {
        setScale(s => s * 1.25)
      }}
      scale={{ x: scale(), y: scale() }}
      anchor={{ x: 0.5, y: 0.5 } as PointLike}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
    />
  )
}

export function Click() {
  return (
    <Application background="#1099bb" resizeTo={window}>
      <Assets load={[['https://v2-pixijs.com/assets/bunny.png']]}>
        <ClickContainer />
      </Assets>
    </Application>
  )
}
