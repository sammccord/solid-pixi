import { type PointLike, Texture } from 'pixi.js'
import { onSettled } from 'solid-js'
import { Application, Loading, P, Stage, render, useApplication, useAssets } from 'solid-pixi'

render(() => <CustomCursor canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function ClickContainer() {
  const app = useApplication()
  const textures = useAssets<{
    'https://pixijs.com/assets/bunny.png': Texture
    'https://pixijs.com/assets/bunny_saturated.png': Texture
  }>(['https://pixijs.com/assets/bunny.png', 'https://pixijs.com/assets/bunny_saturated.png'])
  const defaultIcon = "url('https://pixijs.com/assets/bunny.png'),auto"
  const hoverIcon = "url('https://pixijs.com/assets/bunny_saturated.png'),auto"

  // Add custom cursor styles
  onSettled(() => {
    app.renderer.events.cursorStyles.default = defaultIcon
    app.renderer.events.cursorStyles.hover = hoverIcon
  })

  return (
    <Loading>
      <P.Sprite
        texture={textures()['https://pixijs.com/assets/bunny.png']}
        interactive
        cursor={hoverIcon}
        scale={{ x: 3, y: 3 }}
        anchor={{ x: 0.5, y: 0.5 } as PointLike}
        x={app.screen.width / 2}
        y={app.screen.height / 2}
      />
    </Loading>
  )
}

function CustomCursor(props) {
  return (
    <Application background='#1099bb' resizeTo={window} canvas={props.canvas}>
      <Stage>
        <ClickContainer />
      </Stage>
    </Application>
  )
}
