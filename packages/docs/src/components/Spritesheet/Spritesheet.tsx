import type { PointLike } from 'pixi.js'
import { Application, For, Loading, P, Stage, render, useApplication, useSpritesheet } from 'solid-pixi'

render(() => <Spritesheet canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function SwapContainer() {
  const app = useApplication()
  const spritesheet = useSpritesheet('https://pixijs.com/assets/spritesheet/mc.json')

  return (
    <Loading>
      <For each={Array.from({ length: 50 })}>
        {() => {
          const scale = 0.75 * Math.random() * 2
          return (
            <P.Sprite
              texture={spritesheet().textures[`Explosion_Sequence_A ${10}.png`]}
              x={Math.random() * app.screen.width}
              y={Math.random() * app.screen.height}
              anchor={{ x: 0.5, y: 0.5 } as PointLike}
              rotation={Math.random() * Math.PI}
              scale={{ x: scale, y: scale }}
            />
          )
        }}
      </For>
    </Loading>
  )
}

function Spritesheet(props) {
  return (
    <Application background='#1099bb' resizeTo={window} canvas={props.canvas}>
      <Stage>
        <SwapContainer />
      </Stage>
    </Application>
  )
}
