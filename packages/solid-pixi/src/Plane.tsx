import { ContainerOptions, View, Container as pxContainer } from 'pixi.js'
import { JSX, createEffect, onCleanup, splitProps, untrack } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { ContainerEventTypes, EventTypes, Events, ContainerEvents } from './events'
import { CommonPropKeys, CommonProps } from './interfaces'

export type ExtendedContainer<Data extends object> = pxContainer & Data
export type ContainerProps<Data extends object> = CommonProps<ExtendedContainer<Data>> &
  Omit<ContainerOptions<View>, 'children'> &
  Events &
  ContainerEvents

export function Container<Data extends object = object>(props: ContainerProps<Data>): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, [
    ...ContainerEventTypes,
    ...EventTypes
  ])
  const container = ours.as || (new pxContainer(pixis) as ExtendedContainer<Data>)

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

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    const uses = props.uses
    if (uses) {
      if (Array.isArray(uses)) {
        cleanups = untrack(() => uses.map(fn => fn(container)))
      } else {
        cleanups = untrack(() => [uses(container)])
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  const parent = useParent()
  parent.addChild(container)
  onCleanup(() => {
    parent.removeChild(container)
  })

  // Add the view to the DOM
  return <ParentContext.Provider value={container}>{ours.children}</ParentContext.Provider>
}