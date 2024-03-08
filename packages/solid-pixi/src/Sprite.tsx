import { Sprite as pxSprite, type SpriteOptions } from 'pixi.js'
import { createEffect, onCleanup, splitProps, untrack } from 'solid-js'
import { type Events, EventTypes } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'
import { ParentContext, useParent } from './ParentContext'

export type ExtendedSprite<Data extends object> = pxSprite & Data
export type SpriteProps<Data extends object> = CommonProps<pxSprite, Data> &
  SpriteOptions &
  Events &
  Data

export function Sprite<Data extends object = object>(props: SpriteProps<Data>) {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)
  const sprite = (ours.as || new pxSprite(pixis)) as ExtendedSprite<Data>

  createEffect(() => {
    for (const prop in pixis) {
      ;(sprite as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      sprite.on(event, handler)
      return () => sprite.off(event, handler)
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
        cleanups = untrack(() => uses.map(fn => fn(sprite)))
      } else {
        cleanups = untrack(() => [uses(sprite)])
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  const parent = useParent()
  parent.addChild(sprite)
  onCleanup(() => {
    parent?.removeChild(sprite)
  })

  return <ParentContext.Provider value={sprite}>{ours.children}</ParentContext.Provider>
}
