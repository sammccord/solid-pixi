import { Texture, type PointLike } from 'pixi.js'
import { Application, Assets, Sprite, useApplication } from '../../../../solid-pixi/src/index'

function DraggingContainer() {
  const app = useApplication()

  const texture = Texture.from('https://pixijs.com/assets/bunny.png')

  let dragTarget = null

  function onDragMove(event) {
    if (dragTarget) {
      dragTarget.parent.toLocal(event.global, null, dragTarget.position)
    }
  }

  function onDragEnd() {
    if (dragTarget) {
      app.stage.off('pointermove', onDragMove)
      dragTarget.alpha = 1
      dragTarget = null
    }
  }

  app.stage.interactive = true
  app.stage.hitArea = app.screen
  app.stage.on('pointerup', onDragEnd)
  app.stage.on('pointerupoutside', onDragEnd)

  return (
    <Sprite
      texture={texture}
      x={Math.random() * app.screen.width}
      y={Math.random() * app.screen.height}
      interactive
      cursor="pointer"
      scale={{ x: 3, y: 3 }}
      pointerdown={e => {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        // this.data = event.data;
        e.target.alpha = 0.5
        dragTarget = e.target
        app.stage.on('pointermove', onDragMove)
      }}
      anchor={{ x: 0.5, y: 0.5 } as PointLike}
    />
  )
}

export function Dragging() {
  return (
    <Application background="#1099bb" resizeTo={window}>
      <Assets load={[['https://pixijs.com/assets/bunny.png']]}>
        <DraggingContainer />
      </Assets>
    </Application>
  )
}
