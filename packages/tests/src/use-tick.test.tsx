import type { Application as PixiApplication, Ticker, TickerCallback } from 'pixi.js'
import { Container as PixiContainer } from 'pixi.js'
import { type Element, createRoot, createSignal, flush } from 'solid-js'
import { AppContext, render, useApplication, useTick, Container } from 'solid-pixi'

type Mount = (code: () => unknown, node: PixiContainer) => () => void

const mount = render as unknown as Mount

function fakeApp() {
  const callbacks = new Map<TickerCallback<unknown>, number | undefined>()
  const app = {
    ticker: {
      add: (fn: TickerCallback<unknown>, _context?: unknown, priority?: number) => {
        callbacks.set(fn, priority)
      },
      remove: (fn: TickerCallback<unknown>) => {
        callbacks.delete(fn)
      }
    }
  } as unknown as PixiApplication
  const tick = () => {
    for (const fn of callbacks.keys()) fn.call(undefined, { deltaMS: 16 } as Ticker)
  }
  return { app, callbacks, tick }
}

function withApp(app: PixiApplication, code: () => Element) {
  const root = new PixiContainer()
  const dispose = mount(() => <AppContext value={app}>{code()}</AppContext>, root)
  flush()
  return { root, dispose }
}

test('useApplication throws outside <Application>', () => {
  createRoot(dispose => {
    expect(() => useApplication()).toThrow('useApplication must be called under <Application>')
    dispose()
  })
})

test('adds on mount with its priority and removes on dispose', () => {
  const { app, callbacks } = fakeApp()
  function Scene() {
    useTick(() => {}, { priority: 25 })
    return <Container />
  }
  const { dispose } = withApp(app, () => <Scene />)

  expect([...callbacks.values()]).toEqual([25])

  dispose()
  expect(callbacks.size).toBe(0)
})

test('signal writes inside the callback commit without an explicit flush', () => {
  const { app, tick } = fakeApp()
  const [x, setX] = createSignal(0)
  function Scene() {
    useTick(() => setX(value => value + 1))
    return <Container x={x()} />
  }
  const { root, dispose } = withApp(app, () => <Scene />)

  tick()
  expect((root.children[0] as PixiContainer).x).toBe(1)
  dispose()
})

test('an enabled accessor attaches and detaches the callback', () => {
  const { app, callbacks } = fakeApp()
  const [on, setOn] = createSignal(false)
  function Scene() {
    useTick(() => {}, { enabled: on })
    return <Container />
  }
  const { dispose } = withApp(app, () => <Scene />)

  expect(callbacks.size).toBe(0)

  flush(() => setOn(true))
  expect(callbacks.size).toBe(1)

  flush(() => setOn(false))
  expect(callbacks.size).toBe(0)
  dispose()
})

test('enabled: false never adds the callback', () => {
  const { app, callbacks } = fakeApp()
  function Scene() {
    useTick(() => {}, { enabled: false })
    return <Container />
  }
  const { dispose } = withApp(app, () => <Scene />)

  expect(callbacks.size).toBe(0)
  dispose()
})
