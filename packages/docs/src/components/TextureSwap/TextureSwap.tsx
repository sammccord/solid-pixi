import { type PointLike, Texture } from 'pixi.js'
import { For, Suspense, createSignal } from 'solid-js'
import {
  Application,
  Assets,
  Container,
  Sprite,
  useApplication
} from '../../../../solid-pixi/src/index'

function SwapContainer() {
  const app = useApplication()
  const textures = [
    Texture.from('https://pixijs.com/assets/flowerTop.png'),
    Texture.from('https://pixijs.com/assets/eggHead.png')
  ]
  const [texture, setTexture] = createSignal(0)

  return (
    <Sprite
      texture={textures[texture()]}
      interactive
      pointerdown={() => {
        console.log(texture())
        setTexture(1 - texture())
      }}
      anchor={{ x: 0.5, y: 0.5 } as PointLike}
      x={app.screen.width / 2}
      y={app.screen.height / 2}
    />
  )
}

export function TextureSwap() {
  return (
    <Application background="#1099bb" resizeTo={window}>
      <Assets
        load={[
          ['https://pixijs.com/assets/flowerTop.png', 'https://pixijs.com/assets/eggHead.png']
        ]}
      >
        <SwapContainer />
      </Assets>
    </Application>
  )
}
