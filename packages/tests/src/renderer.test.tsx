import { Container, Sprite, Text } from 'pixi.js'
import { createSignal, flush } from 'solid-js'
import { For, P, Show, render } from 'solid-pixi'

type Mount = (code: () => unknown, node: Container) => () => void

const mount = render as unknown as Mount

function withRoot(code: () => unknown) {
  const root = new Container()
  const dispose = mount(code, root)
  return { root, dispose }
}

const names = (parent: Container) => parent.children.map(child => child.constructor.name)

test('writes are staged until flush, as Solid 2 intends', () => {
  const [x, setX] = createSignal(0)
  const { root, dispose } = withRoot(() => <P.Sprite x={x()} />)
  const sprite = root.children[0] as Sprite

  setX(7)
  expect(sprite.x).toBe(0)

  flush()
  expect(sprite.x).toBe(7)
  dispose()
})

test('mounts a child into the root', () => {
  const { root, dispose } = withRoot(() => <P.Container />)
  expect(names(root)).toEqual(['Container'])
  dispose()
})

test('applies static props at mount', () => {
  const { root, dispose } = withRoot(() => <P.Sprite x={12} alpha={0.25} label="hero" />)
  const sprite = root.children[0] as Sprite
  expect(sprite.x).toBe(12)
  expect(sprite.alpha).toBe(0.25)
  expect(sprite.label).toBe('hero')
  dispose()
})

test('updates a prop when its signal changes', () => {
  const [x, setX] = createSignal(0)
  const { root, dispose } = withRoot(() => <P.Sprite x={x()} />)
  const sprite = root.children[0] as Sprite
  expect(sprite.x).toBe(0)

  flush(() => setX(40))
  expect(sprite.x).toBe(40)
  dispose()
})

test('routes the size prop through setSize', () => {
  const { root, dispose } = withRoot(() => <P.Sprite size={{ width: 30, height: 60 }} />)
  const sprite = root.children[0] as Sprite
  expect(sprite.width).toBe(30)
  expect(sprite.height).toBe(60)
  dispose()
})

test('nests children under their parent', () => {
  const { root, dispose } = withRoot(() => (
    <P.Container label="outer">
      <P.Sprite label="a" />
      <P.Sprite label="b" />
    </P.Container>
  ))
  const outer = root.children[0] as Container
  expect(outer.label).toBe('outer')
  expect(outer.children.map(child => child.label)).toEqual(['a', 'b'])
  dispose()
})

test('hands the instance to a ref callback', () => {
  let seen: Sprite | undefined
  const { dispose } = withRoot(() => <P.Sprite ref={(node: Sprite) => (seen = node)} />)
  expect(seen).toBeInstanceOf(Sprite)
  dispose()
})

test('adopts an existing instance passed as `as`', () => {
  const existing = new Sprite()
  const { root, dispose } = withRoot(() => <P.Sprite as={existing} x={7} />)
  expect(root.children[0]).toBe(existing)
  expect(existing.x).toBe(7)
  dispose()
})

test('turns a string child into a pixi Text', () => {
  const { root, dispose } = withRoot(() => <P.Container>hello</P.Container>)
  const outer = root.children[0] as Container
  expect(outer.children.length).toBe(1)
  expect(outer.children[0]).toBeInstanceOf(Text)
  expect((outer.children[0] as Text).text).toBe('hello')
  dispose()
})

test('Show adds and removes a node', () => {
  const [on, setOn] = createSignal(false)
  const { root, dispose } = withRoot(() => (
    <P.Container>
      <Show when={on()}>
        <P.Sprite label="toggled" />
      </Show>
    </P.Container>
  ))
  const outer = root.children[0] as Container
  expect(outer.children.length).toBe(0)

  flush(() => setOn(true))
  expect(outer.children.map(child => child.label)).toEqual(['toggled'])

  flush(() => setOn(false))
  expect(outer.children.length).toBe(0)
  dispose()
})

test('For reorders without recreating nodes', () => {
  const [items, setItems] = createSignal(['a', 'b', 'c'])
  const { root, dispose } = withRoot(() => (
    <P.Container>
      <For each={items()}>{item => <P.Sprite label={item} />}</For>
    </P.Container>
  ))
  const outer = root.children[0] as Container
  expect(outer.children.map(child => child.label)).toEqual(['a', 'b', 'c'])
  const before = new Map(outer.children.map(child => [child.label, child]))

  flush(() => setItems(['c', 'a', 'b']))
  expect(outer.children.map(child => child.label)).toEqual(['c', 'a', 'b'])
  for (const child of outer.children) expect(before.get(child.label)).toBe(child)

  flush(() => setItems(['a']))
  expect(outer.children.map(child => child.label)).toEqual(['a'])
  dispose()
})

test('renderable=false lets one last write land, then freezes props', () => {
  const [renderable, setRenderable] = createSignal(true)
  const [x, setX] = createSignal(1)
  const { root, dispose } = withRoot(() => <P.Sprite renderable={renderable()} x={x()} />)
  const sprite = root.children[0] as Sprite
  expect(sprite.x).toBe(1)

  flush(() => setRenderable(false))
  expect(sprite.renderable).toBe(false)

  flush(() => setX(2))
  expect(sprite.x).toBe(1)

  flush(() => setRenderable(true))
  flush(() => setX(3))
  expect(sprite.x).toBe(3)
  dispose()
})

test('renderable gating survives a toggle with prop changes in between', () => {
  const [renderable, setRenderable] = createSignal(true)
  const [x, setX] = createSignal(1)
  const { root, dispose } = withRoot(() => <P.Sprite renderable={renderable()} x={x()} />)
  const sprite = root.children[0] as Sprite

  flush(() => {
    setRenderable(false)
    setX(2)
  })
  expect(sprite.renderable).toBe(false)
  expect(sprite.x).toBe(2)

  flush(() => setX(3))
  flush(() => setX(4))
  expect(sprite.x).toBe(2)

  flush(() => setRenderable(true))
  expect(sprite.x).toBe(4)

  flush(() => setRenderable(false))
  flush(() => setX(5))
  expect(sprite.x).toBe(4)
  dispose()
})

test('dispose stops the reactive graph', () => {
  const [x, setX] = createSignal(1)
  const { root, dispose } = withRoot(() => <P.Sprite x={x()} />)
  const sprite = root.children[0] as Sprite

  dispose()
  flush(() => setX(99))
  expect(sprite.x).toBe(1)
})

test('dispose leaves the mounted nodes attached to the root', () => {
  const { root, dispose } = withRoot(() => (
    <P.Container>
      <P.Sprite />
    </P.Container>
  ))
  expect(root.children.length).toBe(1)

  dispose()
  expect(root.children.length).toBe(1)
})
