import { PointLike, Texture } from 'pixi.js'
import { For, Suspense } from 'solid-js'
import {
  Application,
  Assets,
  Container,
  Sprite,
  useApplication
} from '../../../../../../solid-pixi/src/index'

function Aliens() {
  const app = useApplication()
  const alienFrames = ['eggHead.png', 'flowerTop.png', 'helmlok.png', 'skully.png']
  let count = 0

  return (
    <Container
      x={app!.screen.width / 2}
      y={app!.screen.height / 2}
      interactive={true}
      pointerdown={e => {
        e.target.cacheAsBitmap = !e.target.cacheAsBitmap
      }}
      uses={container => {
        app!.ticker.add(() => {
          // let's rotate the aliens a little bit
          for (let i = 0; i < 100; i++) {
            const alien = container.children[i]
            alien.rotation += 0.1
          }

          count += 0.01

          container.scale.x = Math.sin(count)
          container.scale.y = Math.sin(count)
          container.rotation += 0.01
        })
      }}
    >
      <For each={Array.from({ length: 100 })}>
        {(_, i) => (
          <Sprite
            texture={Texture.from(alienFrames[i() % 4])}
            tint={Math.random() * 0xffffff}
            anchor={{ x: 0.5, y: 0.5 } as PointLike}
            x={Math.random() * app!.screen.width - app!.screen.width / 2}
            y={Math.random() * app!.screen.height - app!.screen.height / 2}
          />
        )}
      </For>
    </Container>
  )
}

export function CacheAsBitmap() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Application resizeTo={window}>
        <Assets load={[['https://v2-pixijs.com/assets/spritesheet/monsters.json']]}>
          <Aliens />
        </Assets>
      </Application>
    </Suspense>
  )
}
