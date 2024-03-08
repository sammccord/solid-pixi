import { Text as pxText, type TextOptions, type TextString } from 'pixi.js'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { type Events, EventTypes } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'
import { useParent } from './ParentContext'

export type ExtendedText<Data extends object> = pxText & Data
export type TextProps<Data extends object> = Omit<CommonProps<pxText, Data>, 'children'> &
  Omit<TextOptions, 'text' | 'children'> &
  Events &
  Data & {
    children: TextString
  }

export function Text<Data extends object = object>(props: TextProps<Data>) {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys.concat('children'), EventTypes)
  const text = (ours.as || new pxText(pixis)) as ExtendedText<Data>

  createEffect(() => {
    text.text = ours.children
  })

  createEffect(() => {
    for (const prop in pixis) {
      ;(text as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      text.on(event, handler)
      return () => text.off(event, handler)
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
        cleanups = uses.map(fn => fn(text))
      } else {
        cleanups = [uses(text)]
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  const parent = useParent()
  parent.addChild(text)
  onCleanup(() => {
    parent?.removeChild(text)
  })

  return null
}
