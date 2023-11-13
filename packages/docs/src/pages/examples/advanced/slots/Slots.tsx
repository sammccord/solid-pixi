import { BlurFilter, FillGradient, PointData, TextStyle, Texture } from 'pixi.js'
import { For, Suspense } from 'solid-js'
import {
  Application,
  Assets,
  Container,
  Graphics,
  Sprite,
  useApplication,
  Text
} from '../../../../../../solid-pixi/src/index'

const REEL_WIDTH = 160
const SYMBOL_SIZE = 150

function SlotMachine() {
  const app = useApplication()
  const slotTextures = [
    Texture.from('https://pixijs.com/assets/eggHead.png'),
    Texture.from('https://pixijs.com/assets/flowerTop.png'),
    Texture.from('https://pixijs.com/assets/helmlok.png'),
    Texture.from('https://pixijs.com/assets/skully.png')
  ]
  const margin = (app!.screen.height - SYMBOL_SIZE * 3) / 2

  return (
    <>
      <Container
        y={margin}
        x={Math.round(app!.screen.width - REEL_WIDTH * 5)}
        interactive
        pointerdown={() => {
          console.log('!!!!!!!!')
        }}
      >
        <For each={Array.from({ length: 5 })}>
          {(_, i) => {
            const blur = new BlurFilter()
            blur.blurX = 0
            blur.blurY = 0
            return (
              <Container<{ blur: BlurFilter }> x={i() * REEL_WIDTH} filters={[blur]} blur={blur}>
                <For each={Array.from({ length: 4 })}>
                  {(_, j) => {
                    const symbol = slotTextures[Math.floor(Math.random() * slotTextures.length)]
                    const scale = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height)
                    return (
                      <Sprite
                        texture={symbol}
                        x={Math.round((SYMBOL_SIZE - symbol.width) / 2)}
                        y={j() * SYMBOL_SIZE}
                        scale={{ x: scale, y: scale } as PointData}
                      />
                    )
                  }}
                </For>
              </Container>
            )
          }}
        </For>
      </Container>
      <Graphics
        draw={[
          ['rect', 0, 0, app!.screen.width, margin],
          ['rect', 0, SYMBOL_SIZE * 3 + margin, app!.screen.width, margin],
          ['fill', { color: '#000', alpha: 1 }]
        ]}
      />
      <Text
        uses={ref => {
          ref.x = app!.screen.width / 2 - ref.width / 2
          ref.y = margin / 2 - ref.height / 2
        }}
        style={
          new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: 'red', //new FillGradient(0, 0, 1, 1).addColorStop(0, '#fff').addColorStop(1, '#00ff99'), // gradient
            stroke: {
              color: '#4a1850',
              width: 5
            },
            dropShadow: {
              angle: Math.PI / 6,
              blur: 4,
              color: '#000',
              distance: 6,
              alpha: 1
            },
            wordWrap: true,
            wordWrapWidth: 440
          })
        }
      >
        PIXI MONSTER SLOTS!
      </Text>
      <Text
        interactive
        uses={ref => {
          ref.x = app!.screen.width / 2 - ref.width / 2
          ref.y = app!.screen.height - (margin / 2 - ref.height / 2)
        }}
        style={
          new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: 'red', //new FillGradient(0, 0, 1, 1).addColorStop(0, '#fff').addColorStop(1, '#00ff99'), // gradient
            stroke: {
              color: '#4a1850',
              width: 5
            },
            dropShadow: {
              angle: Math.PI / 6,
              blur: 4,
              color: '#000',
              distance: 6,
              alpha: 1
            },
            wordWrap: true,
            wordWrapWidth: 440
          })
        }
      >
        Spin the wheels!
      </Text>
    </>
  )
}

export function Slots() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Application background="#1099bb" resizeTo={window}>
        <Assets
          load={[
            [
              'https://pixijs.com/assets/eggHead.png',
              'https://pixijs.com/assets/flowerTop.png',
              'https://pixijs.com/assets/helmlok.png',
              'https://pixijs.com/assets/skully.png'
            ]
          ]}
        >
          <SlotMachine />
        </Assets>
      </Application>
    </Suspense>
  )
}
