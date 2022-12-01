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
export interface SimpleRopeProps
  extends Partial<Omit<pxSimpleRope, "children" | keyof Transform>>,
    CommonProps<pxSimpleRope>,
    Transform,
    Partial<Events> {
  texture: Texture<Resource>;
  points: IPoint[];
  textureScale?: number;
}

export function SimpleRope(props: SimpleRopeProps): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes);

  let rope: pxSimpleRope = new pxSimpleRope(
    pixis.texture,
    pixis.points,
    pixis.textureScale
  );

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
    if (props.use) {
      if (Array.isArray(props.use)) {
        props.use.forEach((fn) => fn(rope));
      } else {
        props.use(rope);
      }
    }
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
