import { Suspense, createEffect, createSignal, onCleanup } from 'solid-js'
import { TextStyle, type PointLike } from 'pixi.js'
import { Application, useApplication, Text, Container } from '../../../../solid-pixi/src/index'

function TextContainer() {
  const [skew, setSkew] = createSignal(Math.random())
  const i = setInterval(() => {
    setSkew(Math.random())
  }, 1000)

  onCleanup(() => {
    clearInterval(i)
  })

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
          r.skew.x = skew()
          r.skew.y = -skew()
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
    <Application background="#1099bb" resizeTo={window}>
      <TextContainer />
    </Application>
  )
}
