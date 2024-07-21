import { Sprite } from 'pixi.js'
import { Application, Assets, Graphics } from '../../../../solid-pixi/src/index'

export function GraphicsContainer() {
  const sprite = Sprite.from('https://pixijs.com/assets/bg_rotate.jpg')
  return (
    <>
      <Graphics
        x={50}
        y={50}
        draw={[
          ['moveTo', 0, 0],
          ['lineTo', 100, 200],
          ['lineTo', 200, 200],
          ['lineTo', 240, 100],
          ['stroke', { width: 2, color: 0xffffff }]
        ]}
      />
      <Graphics
        x={50}
        y={50}
        draw={[
          ['bezierCurveTo', 100, 200, 200, 200, 240, 100],
          ['stroke', { width: 1, color: 0xaa0000 }]
        ]}
      />

      {/* Curve with texture */}
      <Graphics
        x={320}
        y={150}
        draw={[
          ['moveTo', 0, 0],
          ['lineTo', 0, -100],
          ['lineTo', 150, 150],
          ['lineTo', 240, 100],
          ['stroke', { width: 2, color: 0xffffff }]
        ]}
      />
      <Graphics
        x={320}
        y={150}
        width={10}
        draw={[
          ['bezierCurveTo', 0, -100, 150, 150, 240, 100],
          ['stroke', { texture: sprite.texture, width: 10 }]
        ]}
      />
      {/* Arc */}
      <Graphics
        draw={[
          ['arc', 600, 100, 50, Math.PI, 2 * Math.PI],
          ['stroke', { width: 5, color: 0xaa00bb }]
        ]}
      />
      <Graphics
        draw={[
          ['arc', 650, 270, 60, 2 * Math.PI, (3 * Math.PI) / 2],
          ['stroke', { width: 5, color: 0x3333dd }]
        ]}
      />
      <Graphics
        draw={[
          ['arc', 650, 420, 60, 2 * Math.PI, (2.5 * Math.PI) / 2],
          ['stroke', { texture: sprite.texture, width: 20 }]
        ]}
      />
      {/* Hole */}
      <Graphics
        draw={[
          ['rect', 350, 350, 150, 150],
          ['fill', 0x00ff00],
          ['circle', 375, 375, 25],
          ['circle', 425, 425, 25],
          ['circle', 475, 475, 25],
          ['cut']
        ]}
      />
      {/* Line Texture */}
      <Graphics
        draw={[
          ['rect', 80, 350, 150, 150],
          ['fill', 0xff000],
          ['stroke', { texture: sprite.texture, width: 20 }]
        ]}
      />
    </>
  )
}

export function AdvancedGraphics() {
  return (
    <Application resizeTo={window}>
      <Assets load={[['https://pixijs.com/assets/bg_rotate.jpg']]}>
        <GraphicsContainer />
      </Assets>
    </Application>
  )
}
