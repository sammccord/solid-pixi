import { Point, PointLike, Texture } from 'pixi.js'
import { For, Suspense, createEffect, createSignal } from 'solid-js'
import {
  Application,
  Assets,
  Container,
  Sprite,
  useApplication
} from '../../../../../../solid-pixi/src/index'

function BunniesContainer() {
  const app = useApplication()
  const texture = Texture.from('https://v2-pixijs.com/assets/bunny.png')
  const [position, setPosition] = createSignal({ x: 20, y: 20 })

  return (
    <Container x={app!.screen.width / 2} y={app!.screen.height / 2}>
      <Sprite
        interactive
        pointerdown={e => {
          console.log(e)
          setPosition({ x: position().x + 5, y: position().y + 5 })
        }}
        texture={texture}
        anchor={{ x: 0.5, y: 0.5 } as PointLike}
        x={(position().x % 5) * 40}
        y={Math.floor(position().y / 5) * 40}
      />
    </Container>
  )
}

export function SimplePlane() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Application background="#1099bb" resizeTo={window}>
        <Assets load={[['https://v2-pixijs.com/assets/bunny.png']]}>
          <BunniesContainer />
        </Assets>
      </Application>
    </Suspense>
  )
}
