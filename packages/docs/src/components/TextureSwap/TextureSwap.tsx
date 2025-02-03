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

render(() => <TextureSwap canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function SwapContainer() {
  const app = useApplication()
  const textures = [
    Texture.from('https://pixijs.com/assets/flowerTop.png'),
    Texture.from('https://pixijs.com/assets/eggHead.png')
  ]
  const [texture, setTexture] = createSignal(0)

  return (
    <P.Sprite
      texture={textures[texture()]}
      interactive
      onpointerdown={() => {
        console.log(texture())
        setTexture(1 - texture())
      }}
      anchor={{ x: 0.5, y: 0.5 } as PointLike}
      x={app!.screen.width / 2}
      y={app!.screen.height / 2}
    />
  )
}

function TextureSwap(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Assets
        load={[
          ['https://pixijs.com/assets/flowerTop.png', 'https://pixijs.com/assets/eggHead.png']
        ]}
      >
        <Stage>
          <SwapContainer />
        </Stage>
      </Assets>
    </Application>
  )
}
