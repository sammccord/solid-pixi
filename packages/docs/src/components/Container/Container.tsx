import { type PointLike, Texture, Ticker } from 'pixi.js'
import { Application, For, P, Stage, Suspense, render, useApplication, useAsset } from 'solid-pixi'

render(() => <ContainerExample canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function ContainerExample(props) {
  return (
    <Application background='#1099bb' resizeTo={window} canvas={props.canvas}>
      <Stage>
        <BunniesContainer />
      </Stage>
    </Application>
  )
}

function BunniesContainer() {
  const app = useApplication()
  const [resource] = useAsset('https://pixijs.com/assets/bunny.png')

  return (
    <Suspense>
      <P.Container
        x={app!.screen.width / 2}
        y={app!.screen.height / 2}
        ref={container => {
          container.pivot = { x: 100, y: 100 }
          const handler = (delta: Ticker) => {
            // rotate the container!
            // use delta to create frame-independent transform
            container.rotation -= 0.001 * delta.deltaMS
          }
          app!.ticker.add(handler)

          return () => {
            app!.ticker.remove(handler)
          }
        }}
      >
        <For each={Array.from({ length: 25 })} fallback={<></>}>
          {(_, i) => (
            <P.Sprite
              texture={resource()}
              anchor={{ x: 0.5, y: 0.5 } as PointLike}
              x={(i() % 5) * 40}
              y={Math.floor(i() / 5) * 40}
            />
          )}
        </For>
      </P.Container>
    </Suspense>
  )
}
