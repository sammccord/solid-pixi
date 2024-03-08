import { Spritesheet, Texture, type PointLike } from 'pixi.js'
import { Match, Switch, createSignal } from 'solid-js'
import { Application, Assets, Sprite } from '../../../../solid-pixi/src/index'

export function AssetsLoading() {
  const [state, setState] = createSignal<'load' | 'game'>('load')

  return (
    <Application background="#1099bb" resizeTo={window}>
      <Assets<{
        flowerTop: Texture
        sprites: Texture
        spritesheet: Spritesheet
        '/solid-pixi/text.txt': string
        '/solid-pixi/json.json': { ip: string }
        eggHead?: Texture
      }>
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
                  },
                  {
                    name: 'sprites',
                    alias: 'sprites',
                    src: 'https://v2-pixijs.com/assets/spritesheet/mc.png'
                  },
                  {
                    name: 'spritesheet',
                    alias: 'spritesheet',
                    src: 'https://v2-pixijs.com/assets/spritesheet/mc.json'
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
        load={[
          [
            'https://v2-pixijs.com/assets/eggHead.png',
            'https://v2-pixijs.com/assets/webfont-loader/ChaChicle.ttf',
            '/solid-pixi/json.json',
            '/solid-pixi/text.txt'
          ]
        ]}
      >
        {r => {
          console.log(r)
          return (
            <Switch>
              <Match when={state() === 'load'}>
                <Sprite
                  texture={r.flowerTop}
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
                  texture={r.eggHead}
                  x={Math.random() * 400}
                  y={Math.random() * 300}
                  anchor={{ x: 0.5, y: 0.5 } as PointLike}
                  rotation={Math.random() * Math.PI}
                />
              </Match>
            </Switch>
          )
        }}
      </Assets>
    </Application>
  )
}
