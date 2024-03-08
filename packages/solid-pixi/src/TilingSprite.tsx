import { type TilingSpriteOptions, TilingSprite as pxTilingSprite } from 'pixi.js'
import { createEffect, onCleanup, splitProps, untrack } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { EventTypes, type Events } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'

export type ExtendedTilingSprite<Data extends object> = pxTilingSprite & Data
export type TilingSpriteProps<Data extends object> = CommonProps<pxTilingSprite, Data> &
  TilingSpriteOptions &
  Events &
  Data

export function TilingSprite<Data extends object = object>(props: TilingSpriteProps<Data>) {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)

  const sprite = (ours.as || new pxTilingSprite(pixis)) as ExtendedTilingSprite<Data>

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
