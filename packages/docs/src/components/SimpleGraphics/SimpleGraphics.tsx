import { Application, Stage, render } from '../../../../solid-pixi/src/index'
import { G } from './G'

render(() => <SimpleGraphics canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function SimpleGraphics(props) {
  return (
    <Application background='#1099bb' resizeTo={window} canvas={props.canvas}>
      <Stage>
        <G />
      </Stage>
    </Application>
  )
}
