import { type Renderable } from 'pixi-unsafe'
import { JSX } from 'solid-js/jsx-runtime'

export interface CommonProps<Component = Renderable, Data = object> {
  children?: JSX.Element
  ref?: (val: Component & Data) => void
  as?: Component
}

export const CommonPropKeys: (keyof CommonProps<Renderable>)[] = ['children', 'as']
