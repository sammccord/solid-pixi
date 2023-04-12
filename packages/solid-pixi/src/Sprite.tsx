import {
  BaseTexture,
  DisplayObjectEvents,
  IBaseTextureOptions,
  Sprite as pxSprite,
  SpriteSource,
  Texture
} from 'pixi.js'
import { createEffect, JSX, onCleanup, splitProps } from 'solid-js'
import { Events, EventTypes } from './events'
import { CommonPropKeys, CommonProps, TextureWithOptions, Transform } from './interfaces'
import { ParentContext, useParent } from './ParentContext'

export type ExtendedSprite<T extends Record<string, any>> = pxSprite & T
export type SpriteProps<T extends Record<string, any>> = Partial<
  Omit<pxSprite, 'texture' | 'children' | keyof Transform>
> &
  T &
  CommonProps<ExtendedSprite<T>> &
  Transform &
  Partial<Events> & {
    from?: SpriteSource
    texture?: TextureWithOptions
    textureOptions?: IBaseTextureOptions<any> | undefined
  }

export function Sprite<T extends Record<string, any>>(props: SpriteProps<T>): JSX.Element {
  let sprite: ExtendedSprite<T>
  const [ours, events, pixis] = splitProps(
    props,
    [...CommonPropKeys, 'texture', 'from', 'textureOptions'],
    EventTypes
  )

  if (ours.as) {
    sprite = ours.as
  } else if (!ours.from && !ours.texture) {
    sprite = new pxSprite(Texture.EMPTY) as ExtendedSprite<T>
  } else {
    sprite =
      ours.texture && ours.texture[0] instanceof Texture
        ? (new pxSprite(ours.texture[0]) as ExtendedSprite<T>)
        : (pxSprite.from(props.from!, props.textureOptions) as ExtendedSprite<T>)
  }

  createEffect(() => {
    if (ours.texture && ours.texture[0] instanceof BaseTexture)
      sprite.texture = new Texture(ours.texture[0], ...(ours.texture.slice(1) as any))
  })

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

  return <ParentContext.Provider value={sprite}>{ours.children}</ParentContext.Provider>
}
