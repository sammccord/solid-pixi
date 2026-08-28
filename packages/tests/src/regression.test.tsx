import { Container as PixiContainer, Graphics as PixiGraphics, Sprite as PixiSprite } from 'pixi.js'
import { createMemo, createSignal, flush } from 'solid-js'
import { Loading, Show, render, Container, Graphics, Sprite } from 'solid-pixi'

const mount = render as unknown as (code: () => unknown, node: PixiContainer) => () => void
const settle = () => new Promise(resolve => setTimeout(resolve, 20))

test('a ref may write a signal without tripping the owned-write rule', () => {
  const root = new PixiContainer()
  const [graphics, setGraphics] = createSignal<PixiGraphics>()

  const dispose = mount(() => <Graphics ref={setGraphics} />, root)
  flush()

  expect(graphics()).toBeInstanceOf(PixiGraphics)
  dispose()
})

test('an async prop reaches the node once it settles under Loading', async () => {
  const root = new PixiContainer()
  const label = createMemo(async () => 'ready')

  const dispose = mount(
    () => (
      <Loading>
        <Sprite label={label()} />
      </Loading>
    ),
    root
  )
  await settle()
  flush()

  expect((root.children[0] as PixiSprite)?.label).toBe('ready')
  dispose()
})

test('a constructor-critical async prop needs a tracked read before the component', async () => {
  const root = new PixiContainer()
  const frames = createMemo(async () => ['a', 'b'])

  const dispose = mount(
    () => (
      <Loading>
        <Show when={frames()} keyed>
          {value => <Container label={value.join('')} />}
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
  const root = new PixiContainer()
  const label = createMemo(async () => 'from-async')

  const dispose = mount(
    () => (
      <Loading>
        <Show when={label()} keyed>
          {value => (
            <Container
              ref={(node: PixiContainer) => {
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
