import { Suspense } from 'solid-js'
import { TextStyle, PointLike } from 'pixi.js'
import {
  Application,
  useApplication,
  Text,
  Container
} from '../../../../../../solid-pixi/src/index'

function TextContainer() {
  return (
    <Container>
      <Text x={50} y={100}>
        Basic text in pixi
      </Text>
      <Text
        x={50}
        y={220}
        style={
          new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: 'red',
            stroke: {
              color: '#4a1850',
              width: 5
            },
            dropShadow: {
              alpha: 1,
              color: '#000000',
              blur: 4,
              angle: Math.PI / 6,
              distance: 6
            },
            wordWrap: true,
            wordWrapWidth: 440
          })
        }
      >
        Rich text with a lot of options and across multiple lines
      </Text>
      <Text
        x={300}
        y={480}
        anchor={{ x: 0.5, y: 0.5 } as PointLike}
        uses={r => {
          console.log(r.skew)
          r.skew.x = 0.65
          r.skew.y = -0.3
        }}
        style={
          new TextStyle({
            fontFamily: 'Arial',
            dropShadow: {
              alpha: 0.8,
              angle: 2.1,
              blur: 4,
              color: '0x111111',
              distance: 10
            },
            fill: '#ffffff',
            stroke: {
              color: '#004620',
              width: 10
            },
            fontSize: 60,
            fontWeight: 'lighter'
          })
        }
      >
        SKEW IS COOL
      </Text>
    </Container>
  )
}

export function TextExample() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Application background="#1099bb" resizeTo={window}>
        <TextContainer />
      </Application>
    </Suspense>
  )
}
