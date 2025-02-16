import { TextStyle } from 'pixi.js'
import { For, Show, Suspense, createEffect } from 'solid-js'
import {
  Application,
  P,
  Stage,
  render,
  useApplication,
  useAsset,
  useBundle
} from '../../../../solid-pixi/src/index'

render(() => <LoadingFonts canvas={document.getElementById('root')! as HTMLCanvasElement} />)

const fonts = [
  { alias: 'ChaChicle', src: 'https://pixijs.com/assets/webfont-loader/ChaChicle.ttf' },
  { alias: 'Lineal', src: 'https://pixijs.com/assets/webfont-loader/Lineal.otf' },
  {
    alias: 'Dotrice Regular',
    src: 'https://pixijs.com/assets/webfont-loader/Dotrice-Regular.woff'
  },
  { alias: 'Crosterian', src: 'https://pixijs.com/assets/webfont-loader/Crosterian.woff2' }
]

function Font(props: { fontFamily: string; y: number }) {
  return (
    <P.Text
      x={10}
      y={props.y}
      style={
        new TextStyle({
          fontFamily: props.fontFamily,
          fontSize: 50
        })
      }
      text={props.fontFamily}
    ></P.Text>
  )
}

function Fonts() {
  const [bundle] = useBundle('fonts', fonts)
  return (
    <Suspense>
      <Show when={bundle()}>
        <For each={fonts}>
          {(fontFamily, i) => <Font y={i() * 150} fontFamily={fontFamily.alias} />}
        </For>
      </Show>
    </Suspense>
  )
}

function LoadingFonts(props) {
  return (
    <Application background='#1099bb' resizeTo={window} canvas={props.canvas}>
      <Stage>
        <Fonts />
      </Stage>
    </Application>
  )
}
