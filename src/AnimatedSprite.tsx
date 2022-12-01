import {
  AnimatedSprite as pxAnimatedSprite,
  DisplayObjectEvents,
  Texture,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";

export interface AnimatedSpriteProps
  extends Partial<
      Omit<pxAnimatedSprite, "texture" | "children" | "name" | keyof Transform>
    >,
    CommonProps<pxAnimatedSprite>,
    Transform,
    Partial<Events> {
  fromFrames?: string[];
  fromImages?: string[];
}

export function AnimatedSprite(props: AnimatedSpriteProps): JSX.Element {
  let sprite: pxAnimatedSprite;
  const [ours, events, pixis] = splitProps(
    props,
    [...CommonPropKeys, "fromFrames", "fromImages"],
    EventTypes
  );

  if (pixis.textures) {
    sprite = new pxAnimatedSprite(pixis.textures, props.autoUpdate);
  } else if (ours.fromFrames) {
    sprite = pxAnimatedSprite.fromFrames(ours.fromFrames);
  } else if (ours.fromImages) {
    sprite = pxAnimatedSprite.fromImages(ours.fromImages);
  } else {
    sprite = new pxAnimatedSprite([Texture.EMPTY]);
  }

  if (ours.key) sprite.name = ours.key;

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

  // Add the view to the DOM
  return (
    <ParentContext.Provider value={sprite}>
      {props.children}
    </ParentContext.Provider>
  );
}
