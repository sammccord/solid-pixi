import { type PointLike, Spritesheet, Texture } from 'pixi.js'
import { createSignal } from 'solid-js'
import {
  Application,
  Assets,
  For,
  Match,
  P,
  Stage,
  Suspense,
  Switch,
  render,
  useApplication,
  useAsset
} from '../../../../solid-pixi/src/index'

render(() => <AssetsLoading canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function AssetsLoading(props) {
  const [state, setState] = createSignal<'load' | 'game'>('load')

  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
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
                      src: 'https://pixijs.com/assets/flowerTop.png'
                    },
                    {
                      name: 'sprites',
                      alias: 'sprites',
                      src: 'https://pixijs.com/assets/spritesheet/mc.png'
                    },
                    {
                      name: 'spritesheet',
                      alias: 'spritesheet',
                      src: 'https://pixijs.com/assets/spritesheet/mc.json'
                    }
                  ]
                },
                {
                  name: 'game-screen',
                  assets: [
                    {
                      name: 'eggHead',
                      alias: 'eggHead',
                      src: 'https://pixijs.com/assets/eggHead.png'
                    }
                  ]
                }
              ]
            }
          }}
          loadBundle={[`${state()}-screen`]}
          load={[
            [
              'https://pixijs.com/assets/eggHead.png',
              'https://pixijs.com/assets/webfont-loader/ChaChicle.ttf',
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
                  <P.Sprite
                    texture={r.flowerTop}
                    x={Math.random() * 400}
                    y={Math.random() * 300}
                    anchor={{ x: 0.5, y: 0.5 } as PointLike}
                    rotation={Math.random() * Math.PI}
                    interactive
                    onpointerdown={() => setState('game')}
                  />
                </Match>
                <Match when={state() === 'game'}>
                  <P.Sprite
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
      </Stage>
    </Application>
  )
}
