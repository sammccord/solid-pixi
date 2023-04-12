import {
  BaseTexture,
  DisplayObjectEvents,
  IBaseTextureOptions,
  ISize,
  Texture,
  TextureSource,
  TilingSprite as pxTilingSprite,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import {
  CommonPropKeys,
  CommonProps,
  TextureWithOptions,
  Transform,
} from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";

export type ExtendedTilingSprite<T extends Record<string, any>> =
  pxTilingSprite & T;
export type TilingSpriteProps<T extends Record<string, any>> = Partial<
  Omit<pxTilingSprite, "children" | "texture" | keyof Transform>
> &
  T &
  CommonProps<ExtendedTilingSprite<T>> &
  Transform &
  Partial<Events> & {
    from?: TextureSource | Texture;
    texture?: TextureWithOptions;
    textureOptions?: ISize & IBaseTextureOptions;
  };

export function TilingSprite<T extends Record<string, any>>(
  props: TilingSpriteProps<T>
): JSX.Element {
  let sprite: ExtendedTilingSprite<T>;
  const [ours, events, pixis] = splitProps(
    props,
    [...CommonPropKeys, "texture", "from", "textureOptions"],
    EventTypes
  );

  if(ours.as) {
    sprite = ours.as
  } else if (!ours.from && !ours.texture) {
    sprite = new pxTilingSprite(Texture.EMPTY) as ExtendedTilingSprite<T>;
  } else {
    sprite =
      ours.texture && ours.texture[0] instanceof Texture
        ? (new pxTilingSprite(
            ours.texture[0],
            ours.textureOptions?.width,
            ours.textureOptions?.height
          ) as ExtendedTilingSprite<T>)
        : (pxTilingSprite.from(
            props.from!,
            props.textureOptions || { width: 0, height: 0 }
          ) as ExtendedTilingSprite<T>);
  }

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
    let cleanups: (void | (() => void))[] = [];
    if (props.use) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map((fn) => fn(sprite));
      } else {
        cleanups.push(props.use(sprite));
      }
    }

    onCleanup(() =>
      cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup())
    );
  });

  const parent = useParent();
  parent?.addChild(sprite);
  onCleanup(() => {
    parent?.removeChild(sprite);
  });

  // Add the view to the DOM
  return (
    <ParentContext.Provider value={sprite}>
      {ours.children}
    </ParentContext.Provider>
  );
}
