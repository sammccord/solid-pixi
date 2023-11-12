import { For } from 'solid-js'
import { Application, useApplication } from '../../../../../solid-pixi/src/index'
import { Container } from 'solid-pixi'
import { Texture } from 'pixi.js'

function BunniesContainer() {
  const app = useApplication()
  const texture = Texture.from('https://v2-pixijs.com/assets/bunny.png')

  return (
    <Container
      x={app!.screen.width / 2}
      y={app!.screen.height / 2}
      use={[
        container => {
          container.pivot = { x: container.width / 2, y: container.height / 2 }
        },
        container => {
          // Listen for animate update
          app!.ticker.add(delta => {
            // rotate the container!
            // use delta to create frame-independent transform
            container.rotation -= 0.01 * delta.deltaMS
          })
        }
      ]}
    >
      <For each={Array.from({ length: 25 })}>
        {(_, i) => (
          <Sprite texture={texture} anchor={0.5} x={(i() % 5) * 40} y={Math.floor(i() / 5) * 40} />
        )}
      </For>
    </Container>
  )
}

export function ContainerExample() {
  return (
    <Application fallback={<div>Loading...</div>}>
      <BunniesContainer />
    </Application>
  )
}
