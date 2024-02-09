import { Suspense } from 'solid-js'
import { Application, Graphics } from '../../../../solid-pixi/src/index'

export function SimpleGraphics() {
  return (
    <Application background="#1099bb" resizeTo={window}>
      <Graphics
        draw={[
          ['rect', 50, 50, 100, 100],
          ['fill', 0xde3249]
        ]}
      />
      <Graphics
        draw={[
          ['rect', 200, 50, 100, 100],
          ['stroke', { width: 2, color: 0xfeeb77 }],
          ['fill', 0x650a5a]
        ]}
      />
      <Graphics
        draw={[
          ['rect', 350, 50, 100, 100],
          ['stroke', { width: 10, color: 0xffbd01 }],
          ['fill', 0xc34288]
        ]}
      />
      <Graphics
        draw={[
          ['circle', 250, 250, 50],
          ['stroke', { width: 10, color: 0xfeeb77 }],
          ['fill', 0x650a5a]
        ]}
      />
      <Graphics
        draw={[
          ['moveTo', 50, 350],
          ['lineTo', 250, 350],
          ['lineTo', 100, 400],
          ['lineTo', 50, 350],
          ['closePath'],
          ['stroke', { width: 4, color: 0xffd900 }],
          ['fill', 0xff3300]
        ]}
      />
      <Graphics
        draw={[
          ['star', 280, 510, 7, 50, 4, 200],
          ['stroke', { width: 4, color: 0xffd900 }],
          ['fill', 0xff3300]
        ]}
      />
    </Application>
  )
}
