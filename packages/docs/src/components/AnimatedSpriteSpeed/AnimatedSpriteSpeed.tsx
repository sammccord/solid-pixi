import {
  AnimatedSprite,
  type PointLike,
  type SpritesheetData,
  Texture,
  Assets as pxAssets
} from 'pixi.js'
import { createEffect, createMemo, createSignal } from 'solid-js'
import {
  Application,
  For,
  P,
  Stage,
  Suspense,
  render,
  useApplication,
  useAsset,
  useSpritesheet
} from 'solid-pixi'

render(() => <AnimatedSpriteSpeed canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function SpeedContainer() {
  const app = useApplication()
  const [spritesheet] = useSpritesheet('https://pixijs.com/assets/spritesheet/0123456789.json')
  const textures = createMemo(() => {
    if (!spritesheet()) return []
    return Array.from({ length: 10 }).map((_, i) => {
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
  })
  const [_slow, setSlow] = createSignal<AnimatedSprite>()
  const [_fast, setFast] = createSignal<AnimatedSprite>()

  createEffect(() => {
    const slow = _slow()
    if (!slow) return
    slow.animationSpeed = 0.5
    slow.x = (app!.screen.width - slow.width) / 2
    slow.play()
  })

  createEffect(() => {
    const fast = _fast()
    if (!fast) return
    fast.x = (app!.screen.width + fast.width) / 2
    fast.play()
  })

  return (
    <>
      <P.AnimatedSprite
        textures={textures()}
        y={app!.screen.height / 2}
        anchor={{ x: 0.5, y: 0.5 } as PointLike}
        scale={{ x: 4, y: 4 }}
        ref={setSlow}
      />
      <P.AnimatedSprite
        textures={textures()}
        y={app!.screen.height / 2}
        anchor={{ x: 0.5, y: 0.5 } as PointLike}
        scale={{ x: 4, y: 4 }}
        ref={setFast}
      />
    </>
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
