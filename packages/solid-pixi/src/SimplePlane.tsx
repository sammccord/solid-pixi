import {
  DisplayObjectEvents,
  Resource,
  SimplePlane as pxSimplePlane,
  Texture,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";

export type ExtendedSimplePlane<T extends Record<string, any>> = pxSimplePlane &
  T;
export type SimplePlaneProps<T extends Record<string, any>> = Partial<
  Omit<pxSimplePlane, "children" | keyof Transform>
> &
  T &
  CommonProps<ExtendedSimplePlane<T>> &
  Transform &
  Partial<Events> & {
    texture: Texture<Resource>;
    verticesX?: number;
    verticesY?: number;
  };

export function SimplePlane<T extends Record<string, any>>(
  props: SimplePlaneProps<T>
): JSX.Element {
  const [ours, events, pixis] = splitProps(
    props,
    [...CommonPropKeys, "verticesX", "verticesY"],
    EventTypes
  );

  let plane = new pxSimplePlane(
    pixis.texture,
    ours.verticesX,
    ours.verticesY
  ) as ExtendedSimplePlane<T>;

  createEffect(() => {
    const handlers: [keyof DisplayObjectEvents, any][] = Object.keys(
      events
    ).map((p) => {
      const handler = events[p as unknown as keyof Events];
      const n = p.split(":")[1] as keyof DisplayObjectEvents;
      plane.on(n, handler as any);
      return [n, handler];
    });

    onCleanup(() => {
      handlers.forEach(([e, handler]) => plane.off(e, handler));
    });
  });

  createEffect(() => {
    for (let key in pixis) {
      (plane as any)[key] = (pixis as any)[key];
    }
  });

  createEffect(() => {
    let cleanups: (void | (() => void))[] = [];
    if (props.use) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map((fn) => fn(plane));
      } else {
        cleanups.push(props.use(plane));
      }
    }

    onCleanup(() =>
      cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup())
    );
  });

  const parent = useParent();
  parent?.addChild(plane);
  onCleanup(() => {
    console.log("cleaning up");
    parent?.removeChild(plane);
  });

  return (
    <ParentContext.Provider value={plane}>
      {ours.children}
    </ParentContext.Provider>
  );
}
