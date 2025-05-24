import { Graphics } from 'pixi.js'
import { Show, Suspense, createEffect, createSignal, onMount } from 'solid-js'
import { Application, P, Stage, render } from 'solid-pixi'

export function Star(props) {
  const [graphics, setG] = createSignal<Graphics>()

  createEffect(() => {
    console.log('!!! effect')
    const g = graphics()
    if (!g) return
    g.star(280, 510, 7, 50, 4, 200)
    g.stroke({ width: 4, color: 0xffd900 })
    g.fill(0xff3300)
  })

  return <P.Graphics x={props.x} y={100} ref={setG}></P.Graphics>
}
