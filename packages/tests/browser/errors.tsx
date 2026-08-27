import type { Application as PixiApplication } from 'pixi.js'
import { Application, Errored, Loading, P, Stage, render, useAsset } from 'solid-pixi'

declare global {
  interface Window {
    errors: { ready: Promise<void>; app: PixiApplication }
  }
}

const canvas = document.getElementById('stage') as HTMLCanvasElement

let resolveReady: () => void
const ready = new Promise<void>(resolve => (resolveReady = resolve))

function Missing() {
  const texture = useAsset('/browser/does-not-exist.png')
  return <P.Sprite label="art" texture={texture()} />
}

render(() => (
  <Application
    canvas={canvas}
    width={64}
    height={64}
    autoStart={false}
    ref={app => {
      window.errors = { ready, app }
      resolveReady()
    }}
  >
    <Stage>
      <Errored fallback={<P.Container label="failed" />}>
        <Loading fallback={<P.Container label="loading" />}>
          <Missing />
        </Loading>
      </Errored>
    </Stage>
  </Application>
))
