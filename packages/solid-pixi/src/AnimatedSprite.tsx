import { AnimatedSprite as pxAnimatedSprite, DisplayObjectEvents, Texture } from 'pixi.js'
import { createEffect, JSX, onCleanup, splitProps } from 'solid-js'
import { Events, EventTypes } from './events'
import { CommonPropKeys, CommonProps, Transform } from './interfaces'
import { ParentContext, useParent } from './ParentContext'

export type ExtendedAnimatedSprite<T extends Record<string, any>> = pxAnimatedSprite & T
export type AnimatedSpriteProps<T extends Record<string, any>> = Partial<
  Omit<pxAnimatedSprite, 'texture' | 'children' | keyof Transform>
> &
  T &
  CommonProps<ExtendedAnimatedSprite<T>> &
  Transform &
  Partial<Events> & {
    fromFrames?: string[]
    fromImages?: string[]
  }

export function AnimatedSprite<T extends Record<string, any>>(
  props: AnimatedSpriteProps<T>
): JSX.Element {
  let sprite: ExtendedAnimatedSprite<T>
  const [ours, events, pixis] = splitProps(
    props,
    [...CommonPropKeys, 'fromFrames', 'fromImages'],
    EventTypes
  )

  if (ours.as) {
    sprite = ours.as
  } else if (pixis.textures) {
    sprite = new pxAnimatedSprite(pixis.textures, props.autoUpdate) as ExtendedAnimatedSprite<T>
  } else if (ours.fromFrames) {
    sprite = pxAnimatedSprite.fromFrames(ours.fromFrames) as ExtendedAnimatedSprite<T>
  } else if (ours.fromImages) {
    sprite = pxAnimatedSprite.fromImages(ours.fromImages) as ExtendedAnimatedSprite<T>
  } else {
    sprite = new pxAnimatedSprite([Texture.EMPTY]) as ExtendedAnimatedSprite<T>
  }

  createEffect(() => {
    const handlers: [keyof DisplayObjectEvents, any][] = Object.keys(events).map(p => {
      const handler = events[p as unknown as keyof Events]
      const n = p.split(':')[1] as keyof DisplayObjectEvents
      sprite.on(n, handler as any)
      return [n, handler]
    })

    onCleanup(() => {
      handlers.forEach(([e, handler]) => sprite.off(e, handler))
    })
  })

  createEffect(() => {
    for (let key in pixis) {
      ;(sprite as any)[key] = (pixis as any)[key]
    }
  })

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    if (props.use) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map(fn => fn(sprite))
      } else {
        cleanups.push(props.use(sprite))
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  const parent = useParent()
  parent?.addChild(sprite)
  onCleanup(() => {
    parent?.removeChild(sprite)
  })

  // Add the view to the DOM
  return <ParentContext.Provider value={sprite}>{ours.children}</ParentContext.Provider>
}
