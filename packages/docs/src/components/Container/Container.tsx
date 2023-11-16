import { type PointLike, Texture } from 'pixi.js'
import { For, Suspense } from 'solid-js'
import {
  Application,
  Assets,
  Container,
  Sprite,
  useApplication
} from '../../../../solid-pixi/src/index'

function BunniesContainer() {
  const app = useApplication()
  const texture = Texture.from('https://v2-pixijs.com/assets/bunny.png')

  return (
    <Container
      x={app!.screen.width / 2}
      y={app!.screen.height / 2}
      uses={[
        container => {
          container.pivot = { x: 100, y: 100 }
        },
        container => {
          // Listen for animate update
          app!.ticker.add(delta => {
            // rotate the container!
            // use delta to create frame-independent transform
            container.rotation -= 0.001 * delta.deltaMS
          })
        }
      ]}
    >
      <For each={Array.from({ length: 25 })} fallback={<></>}>
        {(_, i) => (
          <Sprite
            texture={texture}
            anchor={{ x: 0.5, y: 0.5 } as PointLike}
            x={(i() % 5) * 40}
            y={Math.floor(i() / 5) * 40}
          />
        )}
      </For>
    </Container>
  )
}

export function ContainerExample() {
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
