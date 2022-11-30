import {
  AnimatedSprite as pxAnimatedSprite,
  DisplayObjectEvents,
  Texture,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { Transform, Uses } from "./interfaces";
import { pixiChildren, useDiffChildren } from "./usePixiChildren";

export interface AnimatedSpriteProps
  extends Partial<
      Omit<pxAnimatedSprite, "texture" | "children" | keyof Transform>
    >,
    Transform,
    Partial<Events> {
  children?: any;
  fromFrames?: string[];
  fromImages?: string[];
  textures?: Texture[];
  name: string;
  use?: Uses<pxAnimatedSprite>;
}

export function AnimatedSprite(props: AnimatedSpriteProps): JSX.Element {
  let sprite: pxAnimatedSprite;
  const [ours, events, pixis] = splitProps(
    props,
    ["children", "textures", "fromFrames", "fromImages", "name", "use"],
    EventTypes
  );

  if (ours.textures) {
    sprite = new pxAnimatedSprite(ours.textures, props.autoUpdate);
  } else if (ours.fromFrames) {
    sprite = pxAnimatedSprite.fromFrames(ours.fromFrames);
  } else if (ours.fromImages) {
    sprite = pxAnimatedSprite.fromImages(ours.fromImages);
  } else {
    sprite = new pxAnimatedSprite([Texture.EMPTY]);
  }

  sprite.name = ours.name;

  createEffect(() => {
    if (ours.textures) sprite.textures = ours.textures;
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

  createEffect(() => {
    if (props.use) {
      if (Array.isArray(props.use)) {
        props.use.forEach((fn) => fn(sprite));
      } else {
        props.use(sprite);
      }
    }
  });

  // Add the view to the DOM
  return sprite as unknown as JSX.Element;
}
