import { Suspense } from 'solid-js'
import {
  Application,
  For,
  P,
  Stage,
  render,
  useApplication,
  useAsset
} from '../../../../solid-pixi/src/index'

render(() => <SimpleGraphics canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function SimpleGraphics(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
        <P.Graphics
          ref={g => {
            g.rect(50, 50, 100, 100)
            g.fill(0xde3249)
          }}
        />
        <P.Graphics
          ref={g => {
            g.rect(200, 50, 100, 100)
            g.stroke({ width: 2, color: 0xfeeb77 })
            g.fill(0x650a5a)
          }}
        />
        <P.Graphics
          ref={g => {
            g.rect(350, 50, 100, 100)
            g.stroke({ width: 10, color: 0xffbd01 })
            g.fill(0xc34288)
          }}
        />
        <P.Graphics
          ref={g => {
            g.circle(250, 250, 50)
            g.stroke({ width: 10, color: 0xfeeb77 })
            g.fill(0x650a5a)
          }}
        />
        <P.Graphics
          ref={g => {
            g.moveTo(50, 350)
            g.lineTo(250, 350)
            g.lineTo(100, 400)
            g.lineTo(50, 350)
            g.closePath()
            g.stroke({ width: 4, color: 0xffd900 })
            g.fill(0xff3300)
          }}
        />
        <P.Graphics
          ref={g => {
            g.star(280, 510, 7, 50, 4, 200)
            g.stroke({ width: 4, color: 0xffd900 })
            g.fill(0xff3300)
          }}
        />
      </Stage>
    </Application>
  )
}
