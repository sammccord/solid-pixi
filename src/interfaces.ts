import {
  BaseTexture,
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
