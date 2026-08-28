import type { Container as PixiContainer, PointLike } from 'pixi.js'
import {
  Application,
  For,
  Loading,
  Stage,
  render,
  useApplication,
  useAsset,
  useTick,
  Container,
  Sprite
} from 'solid-pixi'

render(() => <ContainerExample canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function ContainerExample(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
        <BunniesContainer />
      </Stage>
    </Application>
  )
}

function BunniesContainer() {
  const app = useApplication()
  const resource = useAsset('https://pixijs.com/assets/bunny.png')
  let container: PixiContainer | undefined

  // use delta to create frame-independent transform
  useTick(delta => {
    if (container) container.rotation -= 0.001 * delta.deltaMS
  })

  return (
    <Loading>
      <Container
        x={app.screen.width / 2}
        y={app.screen.height / 2}
        ref={node => {
          node.pivot = { x: 100, y: 100 }
          container = node
        }}
      >
        <For each={Array.from({ length: 25 })} fallback={<></>}>
          {(_, i) => (
            <Sprite
              texture={resource()}
              anchor={{ x: 0.5, y: 0.5 } as PointLike}
              x={(i() % 5) * 40}
              y={Math.floor(i() / 5) * 40}
            />
          )}
        </For>
      </Container>
    </Loading>
  )
}
