import type { Application as PixiApplication, Graphics as PixiGraphics } from 'pixi.js'
import { createSignal, flush } from 'solid-js'
import { Application, Show, Stage, render, Container, Graphics, Sprite } from 'solid-pixi'

declare global {
  interface Window {
    mountedDuringFirstRender: boolean
    verify: {
      ready: Promise<void>
      app: PixiApplication
      setTint: (value: number) => void
      setExtra: (value: boolean) => void
      setMessage: (value: string) => void
    }
  }
}

const canvas = document.getElementById('stage') as HTMLCanvasElement
const [tint, setTint] = createSignal(0xff0000)
const [extra, setExtra] = createSignal(false)
// The leading space keeps the glyphs off (0, 0), which the pixel checks sample.
const [message, setMessage] = createSignal(' first')

let resolveReady: () => void
const ready = new Promise<void>(resolve => (resolveReady = resolve))
let childMountedAt = Number.NaN

function Scene() {
  return (
    <Stage>
      <Graphics
        label="box"
        tint={tint()}
        ref={(g: PixiGraphics) => {
          childMountedAt = performance.now()
          g.rect(0, 0, 200, 200)
          g.fill(0xffffff)
        }}
      />
      <Container label="group">
        <Sprite label="child" />
      </Container>
      <Show when={extra()}>
        <Sprite label="extra" />
      </Show>
      {message()}
    </Stage>
  )
}

render(() => (
  <Application
    canvas={canvas}
    width={200}
    height={200}
    background="#000000"
    autoStart={false}
    ref={app => {
      window.verify = {
        ready,
        app,
        setTint: value => {
          flush(() => setTint(value))
          app.render()
        },
        setExtra: value => {
          flush(() => setExtra(value))
          app.render()
        },
        setMessage: value => {
          flush(() => setMessage(value))
          app.render()
        }
      }
      resolveReady()
    }}
  >
    <Scene />
  </Application>
))

window.mountedDuringFirstRender = !Number.isNaN(childMountedAt)
