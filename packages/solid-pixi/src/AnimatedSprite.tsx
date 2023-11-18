import { FrameObject, AnimatedSprite as pxAnimatedSprite, SpriteOptions, Texture } from 'pixi.js'
import { createEffect, onCleanup, splitProps, untrack } from 'solid-js'
import { Events, EventTypes } from './events'
import { CommonPropKeys, CommonProps } from './interfaces'
import { ParentContext, useParent } from './ParentContext'

export type ExtendedAnimatedSprite<Data extends object> = pxAnimatedSprite & Data
export type AnimatedSpriteProps<Data extends object> = CommonProps<ExtendedAnimatedSprite<Data>> &
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
  let sprite: ExtendedAnimatedSprite<Data>
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)

  if (ours.as) {
    sprite = ours.as
  } else {
    sprite = new pxAnimatedSprite(pixis.textures, pixis.autoUpdate) as ExtendedAnimatedSprite<Data>
  }

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
