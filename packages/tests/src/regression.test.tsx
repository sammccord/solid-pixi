import { Container, Graphics, Sprite } from 'pixi.js'
import { createMemo, createSignal, flush } from 'solid-js'
import { Loading, P, Show, render } from 'solid-pixi'

const mount = render as unknown as (code: () => unknown, node: Container) => () => void
const settle = () => new Promise(resolve => setTimeout(resolve, 20))

test('a ref may write a signal without tripping the owned-write rule', () => {
  const root = new Container()
  const [graphics, setGraphics] = createSignal<Graphics>()

  const dispose = mount(() => <P.Graphics ref={setGraphics} />, root)
  flush()

  expect(graphics()).toBeInstanceOf(Graphics)
  dispose()
})

test('an async prop reaches the node once it settles under Loading', async () => {
  const root = new Container()
  const label = createMemo(async () => 'ready')

  const dispose = mount(
    () => (
      <Loading>
        <P.Sprite label={label()} />
      </Loading>
    ),
    root
  )
  await settle()
  flush()

  expect((root.children[0] as Sprite)?.label).toBe('ready')
  dispose()
})

test('a constructor-critical async prop needs a tracked read before the component', async () => {
  const root = new Container()
  const frames = createMemo(async () => ['a', 'b'])

  const dispose = mount(
    () => (
      <Loading>
        <Show when={frames()} keyed>
          {value => <P.Container label={value.join('')} />}
        </Show>
      </Loading>
    ),
    root
  )
  await settle()
  flush()

  expect(root.children[0]?.label).toBe('ab')
  dispose()
})

test('a ref uses an async value captured outside the callback', async () => {
  const root = new Container()
  const label = createMemo(async () => 'from-async')

  const dispose = mount(
    () => (
      <Loading>
        <Show when={label()} keyed>
          {value => (
            <P.Container
              ref={(node: Container) => {
                node.label = value
              }}
            />
          )}
        </Show>
      </Loading>
    ),
    root
  )
  await settle()
  flush()

  expect(root.children[0]?.label).toBe('from-async')
  dispose()
})
