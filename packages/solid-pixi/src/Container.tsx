import { Container as pxContainer, type ContainerOptions } from 'pixi.js'
import { createEffect, onCleanup, splitProps, type JSX } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { ContainerEventTypes, EventTypes, type ContainerEvents, type Events } from './events'
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

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    const uses = props.uses
    if (uses) {
      if (Array.isArray(uses)) {
        cleanups = uses.map(fn => fn(container))
      } else {
        cleanups = [uses(container)]
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
