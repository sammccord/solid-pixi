import { DisplayObjectEvents, NineSlicePlane as pxNineSlicePlane, Resource, Texture } from 'pixi.js'
import { createEffect, JSX, onCleanup, splitProps } from 'solid-js'
import { Events, EventTypes } from './events'
import { CommonPropKeys, CommonProps, Transform } from './interfaces'
import { ParentContext, useParent } from './ParentContext'

export type ExtendedNineSlicePlane<T extends Record<string, any>> = pxNineSlicePlane & T
export type NineSlicePlaneProps<T extends Record<string, any>> = Partial<
  Omit<pxNineSlicePlane, 'children' | keyof Transform>
> &
  T &
  CommonProps<ExtendedNineSlicePlane<T>> &
  Transform &
  Partial<Events> & {
    texture: Texture<Resource>
  }

export function NineSlicePlane<T extends Record<string, any>>(
  props: NineSlicePlaneProps<T>
): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)

  let plane =
    ours.as ||
    (new pxNineSlicePlane(
      pixis.texture,
      pixis.leftWidth,
      pixis.topHeight,
      pixis.rightWidth,
      pixis.bottomHeight
    ) as ExtendedNineSlicePlane<T>)

  createEffect(() => {
    const handlers: [keyof DisplayObjectEvents, any][] = Object.keys(events).map(p => {
      const handler = events[p as unknown as keyof Events]
      const n = p.split(':')[1] as keyof DisplayObjectEvents
      plane.on(n, handler as any)
      return [n, handler]
    })

    onCleanup(() => {
      handlers.forEach(([e, handler]) => plane.off(e, handler))
    })
  })

  createEffect(() => {
    for (let key in pixis) {
      ;(plane as any)[key] = (pixis as any)[key]
    }
  })

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    if (props.use) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map(fn => fn(plane))
      } else {
        cleanups.push(props.use(plane))
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  const parent = useParent()
  parent?.addChild(plane)
  onCleanup(() => {
    parent?.removeChild(plane)
  })

  // Add the view to the DOM
  return <ParentContext.Provider value={plane}>{ours.children}</ParentContext.Provider>
}
