import { Container as pxContainer, DisplayObjectEvents } from 'pixi.js'
import { createEffect, JSX, onCleanup, splitProps } from 'solid-js'
import { Events, EventTypes } from './events'
import { CommonPropKeys, CommonProps, Transform } from './interfaces'
import { ParentContext, useParent } from './ParentContext'

export type ExtendedContainer<T extends Record<string, any>> = pxContainer & T
export type ContainerProps<T extends Record<string, any> = any> = Partial<
  Omit<pxContainer, 'children' | keyof Transform>
> &
  T &
  CommonProps<ExtendedContainer<T>> &
  Transform &
  Partial<Events> & {}

export function Container<T extends Record<string, any> = any>(
  props: ContainerProps<T>
): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)
  let container = ours.as || (new pxContainer() as ExtendedContainer<T>)

  createEffect(() => {
    const handlers: [keyof DisplayObjectEvents, any][] = Object.keys(events).map(p => {
      const handler = events[p as unknown as keyof Events]
      const n = p.split(':')[1] as keyof DisplayObjectEvents
      container.on(n, handler as any)
      return [n, handler]
    })

    onCleanup(() => {
      handlers.forEach(([e, handler]) => container.off(e, handler))
    })
  })

  createEffect(() => {
    for (let key in pixis) {
      ;(container as any)[key] = (pixis as any)[key]
    }
  })

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    if (props.use) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map(fn => fn(container))
      } else {
        cleanups.push(props.use(container))
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  const parent = useParent()
  parent?.addChild(container)
  onCleanup(() => {
    parent?.removeChild(container)
  })

  // Add the view to the DOM
  return <ParentContext.Provider value={container}>{ours.children}</ParentContext.Provider>
}
