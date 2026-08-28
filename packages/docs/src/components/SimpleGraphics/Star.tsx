import type { Graphics as PixiGraphics } from 'pixi.js'
import { createEffect, createSignal } from 'solid-js'
import { Graphics } from 'solid-pixi'

export function Star(props) {
  const [graphics, setG] = createSignal<PixiGraphics>()

  createEffect(
    () => graphics(),
    g => {
      if (!g) return
      g.star(280, 510, 7, 50, 4, 200)
      g.stroke({ width: 4, color: 0xffd900 })
      g.fill(0xff3300)
    }
  )

  return <Graphics x={props.x} y={100} ref={setG} />
}
