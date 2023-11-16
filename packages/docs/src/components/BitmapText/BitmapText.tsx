import { TextStyle } from 'pixi.js'
import { Suspense } from 'solid-js'
import { Application, Assets, Text } from '../../../../solid-pixi/src/index'

function TextContainer() {
  return (
    <Text
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
      bitmap fonts are supported!\nWoo yay!
    </Text>
  )
}

export function BitmapText() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Application background="#1099bb" resizeTo={window}>
        <Assets load={[['https://v2-pixijs.com/assets/bitmap-font/desyrel.xml']]}>
          <TextContainer />
        </Assets>
      </Application>
    </Suspense>
  )
}
