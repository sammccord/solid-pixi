import {
  BaseTexture,
  DisplayObject,
  IAutoDetectOptions,
  IPointData,
  Rectangle,
  Resource,
  Texture
} from 'pixi.js'
import { JSX } from 'solid-js/jsx-runtime'

export type TextureWithOptions = [
  texture: Texture<Resource> | BaseTexture<Resource, IAutoDetectOptions>,
  frame?: Rectangle,
  orig?: Rectangle,
  trim?: Rectangle,
  rotate?: number,
  anchor?: IPointData
]

export interface Transform {
  position?: IPointData
  scale?: IPointData
  skew?: IPointData
  pivot?: IPointData
  rotation?: number
}

export const TransformKeys: (keyof Transform)[] = ['position', 'scale', 'skew', 'pivot']

export type Use<T> = (t: T) => void

export type Uses<T> = Use<T> | Array<Use<T>>

export interface CommonProps<Component> {
  children?: JSX.Element
  use?: Uses<Component>
  as?: Component
}

export const CommonPropKeys: (keyof CommonProps<DisplayObject>)[] = ['children', 'use', 'as']
