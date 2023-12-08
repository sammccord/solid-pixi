import { Suspense } from 'solid-js'
import { Application, Graphics } from '../../../../solid-pixi/src/index'

export function SimpleGraphics() {
  return (
    <Application background="#1099bb" resizeTo={window}>
      <Graphics fillStyle={0xde3249} draw={[['rect', 50, 50, 100, 100], ['fill']]} />
      <Graphics
        fillStyle={0x650a5a}
        draw={[['rect', 200, 50, 100, 100], ['stroke', { width: 2, color: 0xfeeb77 }], ['fill']]}
      />
      <Graphics
        fillStyle={0xc34288}
        draw={[['rect', 350, 50, 100, 100], ['stroke', { width: 10, color: 0xffbd01 }], ['fill']]}
      />
      <Graphics
        fillStyle={0x650a5a}
        draw={[['circle', 250, 250, 50], ['stroke', { width: 10, color: 0xfeeb77 }], ['fill']]}
      />
      <Graphics
        fillStyle={0xff3300}
        draw={[
          ['moveTo', 50, 350],
          ['lineTo', 250, 350],
          ['lineTo', 100, 400],
          ['lineTo', 50, 350],
          ['closePath'],
          ['stroke', { width: 4, color: 0xffd900 }],
          ['fill']
        ]}
      />
      <Graphics
        fillStyle={0xff3300}
        draw={[
          ['star', 280, 510, 7, 50, 4, 200],
          ['stroke', { width: 4, color: 0xffd900 }],
          ['fill']
        ]}
      />
    </Application>
  )
}
