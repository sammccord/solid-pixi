import { type PointLike, type SpritesheetData, Texture, Assets as pxAssets } from 'pixi.js'
import {
  AnimatedSprite,
  Application,
  Assets,
  useApplication
} from '../../../../solid-pixi/src/index'

function SpeedContainer() {
  const app = useApplication()
  const textures = Array.from({ length: 10 }).map((_, i) => {
    const framekey = `0123456789 ${i}.ase`
    const texture = Texture.from(framekey)
    const time = (
      (
        pxAssets.get('https://pixijs.com/assets/spritesheet/0123456789.json')
          .data as SpritesheetData
      ).frames[framekey] as any
    ).duration
    return { texture, time }
  })

  return (
    <>
      <AnimatedSprite
        textures={textures}
        y={app.screen.height / 2}
        animationSpeed={0.5}
        anchor={{ x: 0.5, y: 0.5 } as PointLike}
        scale={{ x: 4, y: 4 }}
        ref={slow => {
          slow.x = (app.screen.width - slow.width) / 2
          slow.play()
        }}
      />
      <AnimatedSprite
        textures={textures}
        y={app.screen.height / 2}
        anchor={{ x: 0.5, y: 0.5 } as PointLike}
        scale={{ x: 4, y: 4 }}
        ref={fast => {
          fast.x = (app.screen.width + fast.width) / 2
          fast.play()
        }}
      />
    </>
  )
}

export function AnimatedSpriteSpeed() {
  return (
    <Application resizeTo={window}>
      <Assets load={[['https://pixijs.com/assets/spritesheet/0123456789.json']]}>
        <SpeedContainer />
      </Assets>
    </Application>
  )
}
