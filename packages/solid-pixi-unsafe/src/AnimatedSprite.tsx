import {
  type FrameObject,
  type SpriteOptions,
  type Texture,
  AnimatedSprite as pxAnimatedSprite
} from 'pixi-unsafe'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { EventTypes, type Events } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'

export type ExtendedAnimatedSprite<Data extends object> = pxAnimatedSprite & Data
export type AnimatedSpriteProps<Data extends object> = CommonProps<pxAnimatedSprite, Data> &
  Omit<SpriteOptions, 'texture'> & {
    textures: Texture[] | FrameObject[]
    autoUpdate?: boolean
    animationSpeed?: number
    loop?: boolean
    updateAnchor?: boolean
    onComplete?: () => void
    onFrameChange?: (currentFrame: number) => void
    onLoop?: () => void
  } & Events &
  Data

export function AnimatedSprite<Data extends object = object>(props: AnimatedSpriteProps<Data>) {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)

  const sprite = (ours.as ||
    new pxAnimatedSprite(pixis.textures, pixis.autoUpdate)) as ExtendedAnimatedSprite<Data>

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
