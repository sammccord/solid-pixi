import { type TextOptions, type TextString, Text as pxText } from 'pixi-unsafe'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { useParent } from './ParentContext'
import { EventTypes, type Events } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'

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

  if (ours.ref) {
    createEffect(() => {
      if (typeof ours.ref === 'function') {
        const cleanup = ours.ref(text)
        if (cleanup as unknown) {
          onCleanup(() => (cleanup as unknown as () => void)())
        }
      } else (ours.ref as any) = text
    })
  }

  const parent = useParent()
  parent.addChild(text)
  onCleanup(() => {
    parent?.removeChild(text)
  })

  return null
}
