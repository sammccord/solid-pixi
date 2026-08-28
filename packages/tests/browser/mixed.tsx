/** @jsxImportSource @solidjs/web */
import type { Application as PixiApplication, Graphics as PixiGraphics } from 'pixi.js'
import { createSignal, flush } from 'solid-js'
import { render } from '@solidjs/web'
import { Application, Graphics, Stage } from 'solid-pixi'

declare global {
  interface Window {
    mixed: {
      ready: Promise<void>
      app: PixiApplication
      setTint: (value: number) => void
    }
  }
}

const [tint, setTint] = createSignal(0xff0000)

let resolveReady: () => void
const ready = new Promise<void>(resolve => (resolveReady = resolve))

function Hud() {
  return (
    <div id="hud">
      <span id="label">{tint().toString(16).padStart(6, '0')}</span>
      <Application
        background="#000000"
        width={120}
        height={120}
        autoStart={false}
        ref={app => {
          window.mixed = {
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
        <Stage>
          <Graphics
            tint={tint()}
            ref={(g: PixiGraphics) => {
              g.rect(0, 0, 120, 120)
              g.fill(0xffffff)
            }}
          />
        </Stage>
      </Application>
    </div>
  )
}

render(() => <Hud />, document.getElementById('root') as HTMLElement)
