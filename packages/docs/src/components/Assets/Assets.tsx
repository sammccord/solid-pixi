import { type PointLike, Spritesheet, Texture } from 'pixi.js'
import { createMemo, createSignal } from 'solid-js'
import {
  Application,
  For,
  Match,
  Stage,
  Loading,
  Switch,
  render,
  useApplication,
  useAsset,
  useAssetInit,
  useBundle,
  Sprite
} from 'solid-pixi'

render(() => <AssetsLoading canvas={document.getElementById('root')! as HTMLCanvasElement} />)

function AssetsLoading(props) {
  const [state, setState] = createSignal<'load' | 'game'>('load')
  const initialized = useAssetInit({
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
  })
  const stateBundle = createMemo(() => `${state()}-screen`)
  const bundle = useBundle<{ flowerTop: Texture; eggHead: Texture }>(stateBundle)

  return (
    <Application background="#1099bb" resizeTo={window} canvas={props.canvas}>
      <Stage>
        <Loading>
          <Switch>
            <Match when={state() === 'load'}>
              <Sprite
                texture={bundle()?.flowerTop}
                x={Math.random() * 400}
                y={Math.random() * 300}
                anchor={{ x: 0.5, y: 0.5 } as PointLike}
                rotation={Math.random() * Math.PI}
                interactive
                onpointerdown={() => setState('game')}
              />
            </Match>
            <Match when={state() === 'game'}>
              <Sprite
                texture={bundle()?.eggHead}
                x={Math.random() * 400}
                y={Math.random() * 300}
                anchor={{ x: 0.5, y: 0.5 } as PointLike}
                rotation={Math.random() * Math.PI}
              />
            </Match>
          </Switch>
        </Loading>
      </Stage>
    </Application>
  )
}
