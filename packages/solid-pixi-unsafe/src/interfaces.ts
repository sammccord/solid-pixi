import type { Renderable } from 'pixi-unsafe'
import type { Ref } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'

export interface CommonProps<Component = Renderable, Data = object> {
  children?: JSX.Element
  ref?: Ref<Component & Data>
  as?: Component
}

export const CommonPropKeys: (keyof CommonProps<Renderable>)[] = ['children', 'as', 'ref']
