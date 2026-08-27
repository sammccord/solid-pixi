import type { Renderable } from 'pixi.js'
import type { Element } from 'solid-js'

export interface CommonProps<Component = Renderable, Data = object> {
  children?: Element
  ref?: (val: Component & Data) => void
  as?: Component
}

export const CommonPropKeys = ['children', 'as'] as const
