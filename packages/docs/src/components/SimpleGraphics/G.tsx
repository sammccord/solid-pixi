import { createSignal } from 'solid-js'
import { Show, Graphics } from 'solid-pixi'
import { Star } from './Star'

export function G(props) {
  const [scale, setScale] = createSignal(100)

  return (
    <>
      <Graphics
        interactive
        onclick={() => setScale(s => s / 2)}
        ref={g => {
          g.rect(50, 50, 100, 100)
          g.fill(0xde3249)
        }}
      />
      <Show when={scale() < 10}>
        <Graphics
          ref={g => {
            g.rect(200, 50, 100, 100)
            g.stroke({ width: 2, color: 0xfeeb77 })
            g.fill(0x650a5a)
          }}
        />
      </Show>

      <Graphics
        ref={g => {
          g.rect(350, 50, 100, 100)
          g.stroke({ width: 10, color: 0xffbd01 })
          g.fill(0xc34288)
        }}
      />
      <Graphics
        ref={g => {
          g.circle(250, 250, 50)
          g.stroke({ width: 10, color: 0xfeeb77 })
          g.fill(0x650a5a)
        }}
      />
      <Graphics
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
      <Star x={scale()} />
    </>
  )
}
