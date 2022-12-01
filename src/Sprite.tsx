import {
  BaseTexture,
  DisplayObjectEvents,
  IBaseTextureOptions,
  Sprite as pxSprite,
  SpriteSource,
  Texture,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import {
  CommonPropKeys,
  CommonProps,
  TextureWithOptions,
  Transform,
  Uses,
} from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";

export interface SpriteProps
  extends Partial<
      Omit<pxSprite, "texture" | "children" | "name" | keyof Transform>
    >,
    CommonProps<pxSprite>,
    Transform,
    Partial<Events> {
  from?: SpriteSource;
  texture?: TextureWithOptions;
  textureOptions?: IBaseTextureOptions<any> | undefined;
}

export function Sprite(props: SpriteProps): JSX.Element {
  let sprite: pxSprite;
  const [ours, events, pixis] = splitProps(
    props,
    [...CommonPropKeys, "texture", "from", "textureOptions"],
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

  if (ours.key) sprite.name = ours.key;

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

  createEffect(() => {
    if (props.use) {
      if (Array.isArray(props.use)) {
        props.use.forEach((fn) => fn(sprite));
      } else {
        props.use(sprite);
      }
    }
  });

  const parent = useParent();
  parent?.addChild(sprite);
  onCleanup(() => {
    parent?.removeChild(sprite);
  });

  return (
    <ParentContext.Provider value={sprite}>
      {props.children}
    </ParentContext.Provider>
  );
}
