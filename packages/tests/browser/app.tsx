import type { Application as PixiApplication, Graphics as PixiGraphics } from 'pixi.js'
import { createSignal, flush } from 'solid-js'
import { Application, Stage, render, Container, Graphics, Sprite } from 'solid-pixi'

declare global {
  interface Window {
    mountedDuringFirstRender: boolean
    verify: {
      ready: Promise<void>
      app: PixiApplication
      setTint: (value: number) => void
    }
  }
}

const canvas = document.getElementById('stage') as HTMLCanvasElement
const [tint, setTint] = createSignal(0xff0000)

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
        }
      }
      resolveReady()
    }}
  >
    <Scene />
  </Application>
))

window.mountedDuringFirstRender = !Number.isNaN(childMountedAt)
