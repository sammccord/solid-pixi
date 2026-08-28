import type { AnimatedSprite as PixiAnimatedSprite, PointLike, SpritesheetData } from 'pixi.js'
import { createMemo } from 'solid-js'
import {
  Application,
  Loading,
  Show,
  Stage,
  render,
  useApplication,
  useSpritesheet,
  AnimatedSprite
} from 'solid-pixi'

render(() => <AnimatedSpriteSpeed canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function SpeedContainer() {
  const app = useApplication()
  const sheet = useSpritesheet('https://pixijs.com/assets/spritesheet/0123456789.json')

  const frames = createMemo(() => {
    const { data, textures } = sheet()
    return Array.from({ length: 10 }, (_, i) => {
      const key = `0123456789 ${i}.ase`
      return {
        texture: textures[key]!,
        time: ((data as SpritesheetData).frames[key] as { duration: number }).duration
      }
    })
  })

  return (
    <Loading>
      <Show when={frames()} keyed>
        {textures => (
          <>
            <AnimatedSprite
              textures={textures}
              animationSpeed={0.5}
              y={app.screen.height / 2}
              anchor={{ x: 0.5, y: 0.5 } as PointLike}
              scale={{ x: 4, y: 4 }}
              ref={(sprite: PixiAnimatedSprite) => {
                sprite.x = (app.screen.width - sprite.width) / 2
                sprite.play()
              }}
            />
            <AnimatedSprite
              textures={textures}
              y={app.screen.height / 2}
              anchor={{ x: 0.5, y: 0.5 } as PointLike}
              scale={{ x: 4, y: 4 }}
              ref={(sprite: PixiAnimatedSprite) => {
                sprite.x = (app.screen.width + sprite.width) / 2
                sprite.play()
              }}
            />
          </>
        )}
      </Show>
    </Loading>
  )
}

function AnimatedSpriteSpeed(props) {
  return (
    <Application resizeTo={window} canvas={props.canvas}>
      <Stage>
        <SpeedContainer />
      </Stage>
    </Application>
  )
}
