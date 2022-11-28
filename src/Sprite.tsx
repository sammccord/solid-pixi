import {
  BaseTexture,
  DisplayObjectEvents,
  IAutoDetectOptions,
  IBaseTextureOptions,
  IPointData,
  Rectangle,
  Resource,
  Sprite as pxSprite,
  SpriteSource,
  Texture,
} from "pixi.js";
import { Accessor, createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { pixiChildren, useDiffChildren } from "./usePixiChildren";

type TextureWithOptions = [
  texture: Texture<Resource> | BaseTexture<Resource, IAutoDetectOptions>,
  frame?: Rectangle,
  orig?: Rectangle,
  trim?: Rectangle,
  rotate?: number,
  anchor?: IPointData
];

type DirectiveAttributes = {
  [Key in keyof Directives as `use:${Key}`]?: Directives[Key];
};

interface Directives {}
interface DirectiveFunctions {
  [x: string]: (el: Element, accessor: Accessor<any>) => void;
}

export interface SpriteProps
  extends Partial<
      Omit<
        pxSprite,
        | "texture"
        | "children"
        | "transform"
        | "position"
        | "scale"
        | "skew"
        | "pivot"
      >
    >,
    Partial<Events> {
  children?: any;
  from?: SpriteSource;
  texture?: TextureWithOptions;
  textureOptions?: IBaseTextureOptions<any> | undefined;
  name: string;
  position?: IPointData;
  scale?: IPointData;
  skew?: IPointData;
  pivot?: IPointData;
}

export function Sprite(props: SpriteProps): JSX.Element {
  let sprite: pxSprite;
  const [ours, events, pixis] = splitProps(
    props,
    [
      "children",
      "texture",
      "from",
      "textureOptions",
      "name",
      "position",
      "scale",
      "rotation",
      "skew",
      "pivot",
    ],
    EventTypes
  );

  if (!ours.from && !ours.texture) {
    sprite = new pxSprite(Texture.EMPTY);
  } else {
    sprite =
      ours.texture && ours.texture[0] instanceof Texture
        ? new pxSprite(ours.texture[0])
        : pxSprite.from(props.from!, props.textureOptions);
  }

  sprite.name = ours.name;

  createEffect(() => {
    if (ours.position) sprite.position.copyFrom(ours.position);
  });

  createEffect(() => {
    if (ours.scale) sprite.scale.copyFrom(ours.scale);
  });

  createEffect(() => {
    if (ours.rotation) sprite.rotation = ours.rotation;
  });

  createEffect(() => {
    if (ours.skew) sprite.skew.copyFrom(ours.skew);
  });

  createEffect(() => {
    if (ours.pivot) sprite.pivot.copyFrom(ours.pivot);
  });

  createEffect(() => {
    if (ours.texture && ours.texture[0] instanceof BaseTexture)
      sprite.texture = new Texture(
        ours.texture[0],
        ...(ours.texture.slice(1) as any)
      );
  });

  createEffect(() => {
    const handlers: [keyof DisplayObjectEvents, any][] = Object.keys(
      events
    ).map((p) => {
      const handler = events[p as unknown as keyof Events];
      const n = p.split(":")[1] as keyof DisplayObjectEvents;
      sprite.on(n, handler as any);
      return [n, handler];
    });

    onCleanup(() => {
      handlers.forEach(([e, handler]) => sprite.off(e, handler));
    });
  });

  createEffect(() => {
    for (let key in pixis) {
      (sprite as any)[key] = (pixis as any)[key];
    }
  });

  const [, update] = useDiffChildren(sprite);
  const resolved = pixiChildren(ours.children);
  createEffect(() => {
    update(resolved());
  });

  // Add the view to the DOM
  return sprite as unknown as JSX.Element;
}
