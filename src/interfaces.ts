import {
  BaseTexture,
  Container,
  DisplayObject,
  IAutoDetectOptions,
  IPointData,
  Rectangle,
  Resource,
  Texture,
} from "pixi.js";
import { Accessor } from "solid-js";

export type TextureWithOptions = [
  texture: Texture<Resource> | BaseTexture<Resource, IAutoDetectOptions>,
  frame?: Rectangle,
  orig?: Rectangle,
  trim?: Rectangle,
  rotate?: number,
  anchor?: IPointData
];

export type DirectiveAttributes = {
  [Key in keyof Directives as `use:${Key}`]?: Directives[Key];
};

export interface Directives {}
export interface DirectiveFunctions {
  [x: string]: (el: Element, accessor: Accessor<any>) => void;
}

export interface Transform {
  position?: IPointData;
  scale?: IPointData;
  skew?: IPointData;
  pivot?: IPointData;
  rotation?: number;
}

export const TransformKeys: (keyof Transform)[] = [
  "position",
  "scale",
  "skew",
  "pivot",
];

export type Use<T> = (t: T) => void | Promise<void>;

export type Uses<T> = Use<T> | Use<T>[];

export interface CommonProps<T> {
  children?: any;
  key?: string;
  use?: Uses<T>;
}

export const CommonPropKeys: (keyof CommonProps<DisplayObject>)[] = [
  "children",
  "key",
  "use",
];
