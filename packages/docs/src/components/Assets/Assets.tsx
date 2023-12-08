import { Texture, type PointLike, Assets as pxAssets } from 'pixi.js'
import { For, Match, Suspense, Switch, createEffect, createSignal } from 'solid-js'
import {
  Sprite,
  Application,
  Assets,
  useApplication,
  SpriteSheet,
  useSpritesheet
} from '../../../../solid-pixi/src/index'

function SwapContainer() {
  const app = useApplication()
  const spritesheet = useSpritesheet()

  return (
    <For each={Array.from({ length: 50 })}>
      {() => {
        const scale = 0.75 * Math.random() * 2
        return (
          <Sprite
            texture={spritesheet.textures[`Explosion_Sequence_A ${10}.png`]}
            x={Math.random() * app.screen.width}
            y={Math.random() * app.screen.height}
            anchor={{ x: 0.5, y: 0.5 } as PointLike}
            rotation={Math.random() * Math.PI}
            scale={{ x: scale, y: scale }}
          />
        )
      }}
    </For>
  )
}

export function AssetsLoading() {
  const [state, setState] = createSignal<'load' | 'game'>('load')

  return (
    <Application background="#1099bb" resizeTo={window}>
      <Assets
        init={{
          manifest: {
            bundles: [
              {
                name: 'load-screen',
                assets: [
                  {
                    name: 'flowerTop',
                    alias: 'flowerTop',
                    src: 'https://v2-pixijs.com/assets/flowerTop.png'
                  }
                ]
              },
              {
                name: 'game-screen',
                assets: [
                  {
                    name: 'eggHead',
                    alias: 'eggHead',
                    src: 'https://v2-pixijs.com/assets/eggHead.png'
                  }
                ]
              }
            ]
          }
        }}
        loadBundle={[`${state()}-screen`]}
      >
        <Switch>
          <Match when={state() === 'load'}>
            <Sprite
              texture={Texture.from('flowerTop')}
              x={Math.random() * 400}
              y={Math.random() * 300}
              anchor={{ x: 0.5, y: 0.5 } as PointLike}
              rotation={Math.random() * Math.PI}
              interactive
              pointerdown={() => setState('game')}
            />
          </Match>
          <Match when={state() === 'game'}>
            <Sprite
              texture={Texture.from('eggHead')}
              x={Math.random() * 400}
              y={Math.random() * 300}
              anchor={{ x: 0.5, y: 0.5 } as PointLike}
              rotation={Math.random() * Math.PI}
            />
          </Match>
        </Switch>
      </Assets>
    </Application>
  )
}
