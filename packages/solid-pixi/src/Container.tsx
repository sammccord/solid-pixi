import { ContainerEvents, ContainerOptions, View, Container as pxContainer } from 'pixi.js'
import { JSX, createEffect, onCleanup, splitProps, untrack } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { EventTypes, Events } from './events'
import { CommonPropKeys, CommonProps } from './interfaces'

export type ContainerProps<T extends View = View> = CommonProps<pxContainer> &
  ContainerOptions<T> &
  Events &
  ContainerEvents

export function Container<T extends View = View>(props: ContainerProps<T>): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)
  const container = ours.as || new pxContainer()

  createEffect(() => {
    for (const prop in pixis) {
      ;(container as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      container.addEventListener(event, handler)
      return () => container.removeEventListener(event, handler)
    })

    onCleanup(() => {
      for (const cleanup of cleanups) {
        cleanup()
      }
    })
  })

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    const uses = props.use
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
