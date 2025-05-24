import { TextStyle } from 'pixi.js'
import {
  Application,
  For,
  P,
  Show,
  Stage,
  Suspense,
  render,
  useApplication,
  useAsset
} from 'solid-pixi'

render(() => <BitmapText canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function TextContainer() {
  const [font] = useAsset('https://pixijs.com/assets/bitmap-font/desyrel.xml')
  return (
    <Show when={font()}>
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
        text={`bitmap fonts are supported!
        Woo yay!`}
      ></P.Text>
    </Show>
  )
}

function BitmapText(props) {
  return (
    <Application background='#1099bb' resizeTo={window} canvas={props.canvas}>
      <Stage>
        <TextContainer />
      </Stage>
    </Application>
  )
}
