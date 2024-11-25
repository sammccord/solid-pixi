import { type ContainerOptions, Container as pxContainer } from 'pixi.js'
import { type JSX, createEffect, onCleanup, splitProps } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { ContainerEventTypes, type ContainerEvents, EventTypes, type Events } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'

export type ExtendedContainer<Data extends object> = pxContainer & Data
export type ContainerProps<Data extends object> = CommonProps<pxContainer, Data> &
  Omit<ContainerOptions, 'children'> &
  Events &
  ContainerEvents &
  Data

export function Container<Data extends object = object>(props: ContainerProps<Data>): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, [
    ...ContainerEventTypes,
    ...EventTypes
  ])
  const container = (ours.as || new pxContainer(pixis)) as ExtendedContainer<Data>

  createEffect(() => {
    for (const prop in pixis) {
      ;(container as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      container.on(event, handler)
      return () => container.off(event, handler)
    })

    onCleanup(() => {
      for (const cleanup of cleanups) {
        cleanup()
      }
    })
  })

  if (ours.ref) {
    createEffect(() => {
      if (typeof ours.ref === 'function') {
        const cleanup = ours.ref(container)
        if (cleanup as unknown) {
          onCleanup(() => (cleanup as unknown as () => void)())
        }
      } else (ours.ref as any) = container
    })
  }

  const parent = useParent()
  parent.addChild(container)
  onCleanup(() => {
    parent.removeChild(container)
  })

  // Add the view to the DOM
  return <ParentContext.Provider value={container}>{ours.children}</ParentContext.Provider>
}
