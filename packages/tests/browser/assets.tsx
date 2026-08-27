import type { Application as PixiApplication, Renderer, Container as PixiContainer } from 'pixi.js'
import { createEffect, createSignal, flush } from 'solid-js'
import { Application, P, Stage, render, useAsset } from 'solid-pixi'

declare global {
  interface Window {
    assets: {
      ready: Promise<void>
      app: PixiApplication
      renderer: Renderer
      stage: PixiContainer
      progressWhileLoading: number[]
      spriteMountedDuringFirstRender: boolean
      setBackground: (value: string) => void
    }
  }
}

const canvas = document.getElementById('stage') as HTMLCanvasElement
const [background, setBackground] = createSignal('#000000')

let resolveReady: () => void
const ready = new Promise<void>(resolve => (resolveReady = resolve))
let spriteMounted = false
const progressWhileLoading: number[] = []

function Art() {
  const texture = useAsset('/browser/green.png')

  createEffect(
    () => texture.progress(),
    value => void progressWhileLoading.push(value)
  )

  return (
    <Stage>
      <P.Sprite
        label="art"
        texture={texture()}
        width={200}
        height={200}
        ref={() => {
          spriteMounted = true
        }}
      />
    </Stage>
  )
}

render(() => (
  <Application
    canvas={canvas}
    width={200}
    height={200}
    background={background()}
    autoStart={false}
    ref={app => {
      window.assets = {
        ready,
        app,
        renderer: app.renderer,
        stage: app.stage,
        progressWhileLoading,
        spriteMountedDuringFirstRender: spriteMounted,
        setBackground: value => flush(() => setBackground(value))
      }
      resolveReady()
    }}
  >
    <Art />
  </Application>
))
