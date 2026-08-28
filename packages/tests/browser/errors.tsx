import type { Application as PixiApplication } from 'pixi.js'
import {
  Application,
  Errored,
  Loading,
  Stage,
  render,
  useAsset,
  Container,
  Sprite
} from 'solid-pixi'

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
  return <Sprite label="art" texture={texture()} />
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
      <Errored fallback={<Container label="failed" />}>
        <Loading fallback={<Container label="loading" />}>
          <Missing />
        </Loading>
      </Errored>
    </Stage>
  </Application>
))
