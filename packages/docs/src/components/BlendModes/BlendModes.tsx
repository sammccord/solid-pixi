import { type PointLike, Rectangle } from 'pixi.js'
import { createStore } from 'solid-js'
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

render(() => <BlendModes canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function Dudes() {
  const app = useApplication()
  const texture = useAsset('https://pixijs.com/assets/eggHead.png')
  const [dudes, setDudes] = createStore(
    Array.from({ length: 20 }).map(() => {
      const scale = 0.8 + Math.random() * 0.3
      return {
        direction: Math.random() * Math.PI * 2,
        x: Math.random() * app.screen.width,
        y: Math.random() * app.screen.height,
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
    app.screen.width + dudeBoundsPadding * 2,
    app.screen.height + dudeBoundsPadding * 2
  )

  useTick(() => {
    setDudes(draft => {
      for (const dude of draft) {
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
      }
    })
  })

  return (
    <Loading>
      <For each={dudes}>
        {dude => (
          <Sprite
            texture={texture()}
            scale={dude.scale}
            anchor={{ x: 0.5, y: 0.5 } as PointLike}
            blendMode={'add'}
            x={dude.x}
            y={dude.y}
            rotation={dude.rotation}
            tint={dude.tint}
          />
        )}
      </For>
    </Loading>
  )
}

function Background() {
  const app = useApplication()
  const texture = useAsset('https://pixijs.com/assets/bg_rotate.jpg')
  return (
    <Loading>
      <Sprite texture={texture()} width={app.stage.width} height={app.stage.height} />
    </Loading>
  )
}

function BlendModes(props) {
  return (
    <Application resizeTo={window} canvas={props.canvas}>
      <Stage>
        <Background />
        <Container>
          <Dudes />
        </Container>
      </Stage>
    </Application>
  )
}
