import {
  DisplayObjectEvents,
  IPoint,
  Resource,
  SimpleRope as pxSimpleRope,
  Texture,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";

export type ExtendedSimpleRope<T extends Record<string, any>> = pxSimpleRope &
  T;
export type SimpleRopeProps<T extends Record<string, any>> = Partial<
  Omit<pxSimpleRope, "children" | keyof Transform>
> &
  T &
  CommonProps<ExtendedSimpleRope<T>> &
  Transform &
  Partial<Events> & {
    texture: Texture<Resource>;
    points: IPoint[];
    textureScale?: number;
  };

export function SimpleRope<T extends Record<string, any>>(
  props: SimpleRopeProps<T>
): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes);

  let rope = new pxSimpleRope(
    pixis.texture,
    pixis.points,
    pixis.textureScale
  ) as ExtendedSimpleRope<T>;

  createEffect(() => {
    const handlers: [keyof DisplayObjectEvents, any][] = Object.keys(
      events
    ).map((p) => {
      const handler = events[p as unknown as keyof Events];
      const n = p.split(":")[1] as keyof DisplayObjectEvents;
      rope.on(n, handler as any);
      return [n, handler];
    });

    onCleanup(() => {
      handlers.forEach(([e, handler]) => rope.off(e, handler));
    });
  });

  createEffect(() => {
    for (let key in pixis) {
      (rope as any)[key] = (pixis as any)[key];
    }
  });

  createEffect(() => {
    let cleanups: (void | (() => void))[] = [];
    if (props.use) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map((fn) => fn(rope));
      } else {
        cleanups.push(props.use(rope));
      }
    }

    onCleanup(() =>
      cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup())
    );
  });

  const parent = useParent();
  parent?.addChild(rope);
  onCleanup(() => {
    console.log("cleaning up");
    parent?.removeChild(rope);
  });

  return (
    <ParentContext.Provider value={rope}>
      {ours.children}
    </ParentContext.Provider>
  );
}
