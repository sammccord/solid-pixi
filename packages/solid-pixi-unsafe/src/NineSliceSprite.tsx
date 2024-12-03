import { type NineSliceSpriteOptions, NineSliceSprite as pxNineSliceSprite } from 'pixi-unsafe'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { EventTypes, type Events } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'

export type ExtendedNineSliceSprite<Data extends object> = pxNineSliceSprite & Data
export type NineSliceSpriteProps<Data extends object> = CommonProps<pxNineSliceSprite, Data> &
  NineSliceSpriteOptions &
  Events &
  Data

export function NineSliceSprite<Data extends object = object>(props: NineSliceSpriteProps<Data>) {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)

  const sprite = (ours.as || new pxNineSliceSprite(pixis)) as ExtendedNineSliceSprite<Data>

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

  if (ours.ref) {
    createEffect(() => {
      if (typeof ours.ref === 'function') {
        const cleanup = ours.ref(sprite)
        if (cleanup as unknown) {
          onCleanup(() => (cleanup as unknown as () => void)())
        }
      } else (ours.ref as any) = sprite
    })
  }

  const parent = useParent()
  parent.addChild(sprite)
  onCleanup(() => {
    parent?.removeChild(sprite)
  })

  return <ParentContext.Provider value={sprite}>{ours.children}</ParentContext.Provider>
}
