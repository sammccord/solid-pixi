import { Graphics } from 'pixi.js'
import { createEffect, createSignal, flush, onSettled } from 'solid-js'
import { Application, P, Stage, render, useApplication } from 'solid-pixi'

render(() => <DynamicGraphics canvas={document.getElementById('root')! as HTMLCanvasElement} />)

export function GraphicsContainer() {
  const app = useApplication()
  const [_count, setCount] = createSignal(0)
  const [_graphics, setGraphics] = createSignal<Graphics>()

  onSettled(() => {
    const ticker = () => flush(() => setCount(c => c + 0.1))
    app.ticker.add(ticker)
    return () => app.ticker.remove(ticker)
  })

  createEffect(
    () => ({ graphics: _graphics(), count: _count() }),
    ({ graphics, count }) => {
      if (!graphics) return
      graphics
        .clear()
        .moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20)
        .lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20)
        .lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20)
        .lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20)
        .lineTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20)
        .fill({ color: 0xffff00, alpha: 0.5 })
        .stroke({ width: 10, color: 0xff0000 })
    }
  )

  return <P.Graphics x={400} y={300} rotation={_count() * 0.1} ref={setGraphics} />
}

function DynamicGraphics(props) {
  return (
    <Application resizeTo={window} canvas={props.canvas}>
      <Stage>
        <GraphicsContainer />
      </Stage>
    </Application>
  )
}
