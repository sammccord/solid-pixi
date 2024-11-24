import {
  IPoint,
  IPointData,
  ObservablePoint,
  Container as pContainer,
  Text as pText
} from 'pixi.js'
import { createSignal } from 'solid-js'
import { Container, Text } from 'solid-pixi'
import { render } from 'solid-testing-library'
import { describe, expect, test } from 'vitest'

describe('<Container />', () => {
  test('renders', () => {
    let inst
    const { unmount } = render(() => <Container use={c => (inst = c)} />)

    expect(inst).instanceOf(pContainer)
    unmount()
  })

  test('renders children', () => {
    let container, child
    const { unmount } = render(() => (
      <Container use={c => (container = c)}>
        <Text use={t => (child = t)}>Fantastic</Text>
      </Container>
    ))

    expect(child).instanceOf(pText)
    expect(child.parent).toBe(container)
    unmount()
  })

  test('passes pixi props to instance', () => {
    let inst: pContainer

    const [position, setPosition] = createSignal<IPointData>({ x: 10, y: 10 })
    const { unmount } = render(() => (
      <Container use={c => (inst = c)} x={position().x} y={position().y} />
    ))

    expect(inst!.x).toBe(10)
    expect(inst!.y).toBe(10)
    setPosition({ x: 20, y: 20 })
    expect(inst!.x).toBe(20)
    expect(inst!.y).toBe(20)

    unmount()
  })
})
