import { Suspense, createEffect, createSignal } from 'solid-js'
import { Application, Graphics, useApplication } from '../../../../solid-pixi/src/index'

export function GraphicsContainer() {
  const app = useApplication()
  const [count, setCount] = createSignal(0)

  createEffect(() => {
    const ticker = () => {
      setCount(c => c + 0.1)
    }
    app.ticker.add(ticker)

    return () => app.ticker.remove(ticker)
  })

  return (
    <>
      <Graphics
        x={400}
        y={300}
        fillStyle={{ color: 0xffff00, alpha: 0.5 }}
        rotation={count() * 0.1}
        draw={[
          ['clear'],
          ['moveTo', -120 + Math.sin(count()) * 20, -100 + Math.cos(count()) * 20],
          ['lineTo', 120 + Math.cos(count()) * 20, -100 + Math.sin(count()) * 20],
          ['lineTo', 120 + Math.sin(count()) * 20, 100 + Math.cos(count()) * 20],
          ['lineTo', -120 + Math.cos(count()) * 20, 100 + Math.sin(count()) * 20],
          ['lineTo', -120 + Math.sin(count()) * 20, -100 + Math.cos(count()) * 20],
          ['fill'],
          ['stroke', { width: 10, color: 0xff0000 }]
        ]}
      />
    </>
  )
}

export function DynamicGraphics() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Application resizeTo={window}>
        <GraphicsContainer />
      </Application>
    </Suspense>
  )
}
