import { TextStyle } from 'pixi.js'
import { For, Suspense } from 'solid-js'
import { Application, Assets, Text } from '../../../../solid-pixi/src/index'

const bundle = {
  ChaChicle: 'https://v2-pixijs.com/assets/webfont-loader/ChaChicle.ttf',
  Lineal: 'https://v2-pixijs.com/assets/webfont-loader/Lineal.otf',
  'Dotrice Regular': 'https://v2-pixijs.com/assets/webfont-loader/Dotrice-Regular.woff',
  Crosterian: 'https://v2-pixijs.com/assets/webfont-loader/Crosterian.woff2'
}

function Font(props: { fontFamily: string; y: number }) {
  console.log(props.fontFamily)
  return (
    <Text
      x={10}
      y={props.y}
      style={
        new TextStyle({
          fontFamily: props.fontFamily,
          fontSize: 50
        })
      }
    >
      {props.fontFamily}
    </Text>
  )
}

export function LoadingFonts() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Application background="#1099bb" resizeTo={window}>
        <Assets addBundle={['fonts', bundle]} loadBundle={['fonts']}>
          <For each={Object.keys(bundle)}>
            {(fontFamily, i) => <Font y={i() * 150} fontFamily={fontFamily} />}
          </For>
        </Assets>
      </Application>
    </Suspense>
  )
}
