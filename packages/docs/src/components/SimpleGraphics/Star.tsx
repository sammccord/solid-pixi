import { Graphics } from 'pixi.js'
import { Show, Suspense, createEffect, createSignal, onMount } from 'solid-js'
import { Application, P, Stage, render } from '../../../../solid-pixi/src/index'

export function Star(props) {
  const [graphics, setG] = createSignal<Graphics>()

  createEffect(() => {
    const g = graphics()
    if (!g) return
    g.star(280, 510, 7, 50, 4, 200)
    g.stroke({ width: 4, color: 0xffd900 })
    g.fill(0xff3300)
  })

  return <P.Graphics x={100} y={100 + props.x} ref={setG}></P.Graphics>
}
