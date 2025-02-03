import { TextStyle } from 'pixi.js'
import { createSignal, onCleanup } from 'solid-js'
import { Application, P, Stage, render } from '../../../../solid-pixi/src/index'

render(() => <TextExample canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function TextContainer() {
  const [skew, setSkew] = createSignal(Math.random())
  const i = setInterval(() => {
    setSkew(Math.random())
  }, 1000)

  onCleanup(() => {
    clearInterval(i)
  })

  return (
    <P.Container>
      <P.Text x={50} y={100} text={'Basic text in pixi'}></P.Text>
      <P.Text
        x={50}
        y={220}
        text={'Rich text with a lot of options and across multiple lines'}
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
      ></P.Text>
      <P.Text
        x={300}
        y={480}
        anchor={{ x: 0.5, y: 0.5 }}
        ref={r => {
          const sk = skew()
          r.skew.x = sk
          r.skew.y = -sk
        }}
        text={'SKEW IS COOL'}
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
      ></P.Text>
    </P.Container>
  )
}

function TextExample(props) {
  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
        <TextContainer />
      </Stage>
    </Application>
  )
}
