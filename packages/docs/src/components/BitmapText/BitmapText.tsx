import { TextStyle } from 'pixi.js'
import {
  Application,
  Assets,
  For,
  P,
  Stage,
  Suspense,
  render,
  useApplication,
  useAsset
} from '../../../../solid-pixi/src/index'

render(() => <BitmapText canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function TextContainer() {
  return (
    <P.Text
      x={50}
      y={220}
      style={
        new TextStyle({
          fontFamily: 'Desyrel',
          fill: 'red',
          stroke: {
            color: '#4a1850',
            width: 5
          },
          fontSize: 36,
          align: 'left'
        })
      }
    >
      {`bitmap fonts are supported!
        Woo yay!`}
    </P.Text>
  )
}

function BitmapText(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
        <Assets load={[['https://pixijs.com/assets/bitmap-font/desyrel.xml']]}>
          <TextContainer />
        </Assets>
      </Stage>
    </Application>
  )
}
