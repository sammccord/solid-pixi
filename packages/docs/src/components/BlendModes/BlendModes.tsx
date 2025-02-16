import { type PointLike, Rectangle, Sprite, Texture } from 'pixi.js'
import { createStore, produce } from 'solid-js/store'
import {
  Application,
  For,
  P,
  Stage,
  Suspense,
  render,
  useApplication,
  useAsset
} from '../../../../solid-pixi/src/index'

render(() => <BlendModes canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function Dudes() {
  const app = useApplication()
  const [texture] = useAsset('https://pixijs.com/assets/eggHead.png')
  const [dudes, setDudes] = createStore(
    Array.from({ length: 20 }).map(() => {
      const scale = 0.8 + Math.random() * 0.3
      return {
        direction: Math.random() * Math.PI * 2,
        x: Math.random() * app!.screen.width,
        y: Math.random() * app!.screen.height,
        rotation: 0,
        turningSpeed: Math.random() - 0.8,
        speed: 2 + Math.random() * 2,
        tint: Math.random() * 0xffffff,
        scale: { x: scale, y: scale }
      }
    })
  )

  const dudeBoundsPadding = 100
  const dudeBounds = new Rectangle(
    -dudeBoundsPadding,
    -dudeBoundsPadding,
    app!.screen.width + dudeBoundsPadding * 2,
    app!.screen.height + dudeBoundsPadding * 2
  )

  app?.ticker.add(() => {
    for (let i = 0; i < 20; i++) {
      setDudes(
        i,
        produce(dude => {
          const newDirection = dude.direction + dude.turningSpeed * 0.01
          dude.direction = newDirection
          dude.x += Math.sin(dude.direction) * dude.speed
          dude.y += Math.cos(dude.direction) * dude.speed
          dude.rotation = -newDirection - Math.PI / 2
          if (dude.x < dudeBounds.x) {
            dude.x += dudeBounds.width
          } else if (dude.x > dudeBounds.x + dudeBounds.width) {
            dude.x -= dudeBounds.width
          }

          if (dude.y < dudeBounds.y) {
            dude.y += dudeBounds.height
          } else if (dude.y > dudeBounds.y + dudeBounds.height) {
            dude.y -= dudeBounds.height
          }
        })
      )
    }
  })

  return (
    <Suspense>
      <For each={dudes}>
        {dude => {
          return (
            <P.Sprite
              texture={texture()}
              scale={dude.scale}
              anchor={{ x: 0.5, y: 0.5 } as PointLike}
              blendMode={'add'}
              x={dude.x}
              y={dude.y}
              rotation={dude.rotation}
              tint={dude.tint}
            />
          )
        }}
      </For>
    </Suspense>
  )
}

function Background() {
  const app = useApplication()
  const [texture] = useAsset('https://pixijs.com/assets/bg_rotate.jpg')
  return (
    <Suspense>
      <P.Sprite texture={texture()} width={app?.stage.width} height={app?.stage.height} />
    </Suspense>
  )
}

function BlendModes(props) {
  return (
    <Application resizeTo={window} canvas={props.canvas}>
      <Stage>
        <Background />
        <P.Container>
          <Dudes />
        </P.Container>
      </Stage>
    </Application>
  )
}
