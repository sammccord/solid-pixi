import { Sprite } from 'pixi.js'
import {
  Application,
  For,
  P,
  Show,
  Stage,
  Suspense,
  render,
  useApplication,
  useAsset
} from 'solid-pixi'

render(() => <AdvancedGraphics canvas={document.getElementById('root')! as HTMLCanvasElement} />)

export function GraphicsContainer() {
  const [sprite] = useAsset('https://pixijs.com/assets/bg_rotate.jpg')
  return (
    <Suspense>
      <Show when={sprite()}>
        <P.Graphics
          x={50}
          y={50}
          ref={g => {
            g.moveTo(0, 0)
            g.lineTo(100, 200)
            g.lineTo(200, 200)
            g.lineTo(240, 100)
            g.stroke({ width: 2, color: 0xffffff })
          }}
        />
        <P.Graphics
          x={50}
          y={50}
          ref={g => {
            g.bezierCurveTo(100, 200, 200, 200, 240, 100)
            g.stroke({ width: 1, color: 0xaa0000 })
          }}
        />

        {/* Curve with texture */}
        <P.Graphics
          x={320}
          y={150}
          ref={g => {
            g.moveTo(0, 0)
            g.lineTo(0, -100)
            g.lineTo(150, 150)
            g.lineTo(240, 100)
            g.stroke({ width: 2, color: 0xffffff })
          }}
        />
        <P.Graphics
          x={320}
          y={150}
          width={10}
          ref={g => {
            g.bezierCurveTo(0, -100, 150, 150, 240, 100)
            g.stroke({ texture: sprite(), width: 10 })
          }}
        />
        {/* Arc */}
        <P.Graphics
          ref={g => {
            g.arc(600, 100, 50, Math.PI, 2 * Math.PI)
            g.stroke({ width: 5, color: 0xaa00bb })
          }}
        />
        <P.Graphics
          ref={g => {
            g.arc(650, 270, 60, 2 * Math.PI, (3 * Math.PI) / 2)
            g.stroke({ width: 5, color: 0x3333dd })
          }}
        />
        <P.Graphics
          ref={g => {
            g.arc(650, 420, 60, 2 * Math.PI, (2.5 * Math.PI) / 2)
            g.stroke({ texture: sprite(), width: 20 })
          }}
        />
        {/* Hole */}
        <P.Graphics
          ref={g => {
            g.rect(350, 350, 150, 150)
            g.fill(0x00ff00)
            g.circle(375, 375, 25)
            g.circle(425, 425, 25)
            g.circle(475, 475, 25)
            g.cut()
          }}
        />
        {/* Line Texture */}
        <P.Graphics
          ref={g => {
            g.rect(80, 350, 150, 150)
            g.fill()
            g.stroke({ texture: sprite(), width: 20 })
          }}
        />
      </Show>
    </Suspense>
  )
}

function AdvancedGraphics(props) {
  return (
    <Application resizeTo={window} canvas={props.canvas}>
      <Stage>
        <GraphicsContainer />
      </Stage>
    </Application>
  )
}
