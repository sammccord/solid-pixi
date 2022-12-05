import {
  DisplayObjectEvents,
  Graphics as pxGraphics,
  GraphicsGeometry,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";

export type ExtendedGraphics<T extends Record<string, any>> = pxGraphics & T;
export type GraphicsProps<T extends Record<string, any>> = Partial<
  Omit<pxGraphics, "children" | keyof Transform>
> &
  T &
  CommonProps<ExtendedGraphics<T>> &
  Transform &
  Partial<Events> & {
    geometry?: GraphicsGeometry;
  };

export function Graphics<T extends Record<string, any>>(
  props: GraphicsProps<T>
): JSX.Element {
  const [ours, events, pixis] = splitProps(
    props,
    [...CommonPropKeys, "geometry"],
    EventTypes
  );
  let graphics = new pxGraphics(ours.geometry) as ExtendedGraphics<T>;

  createEffect(() => {
    const handlers: [keyof DisplayObjectEvents, any][] = Object.keys(
      events
    ).map((p) => {
      const handler = events[p as unknown as keyof Events];
      const n = p.split(":")[1] as keyof DisplayObjectEvents;
      graphics.on(n, handler as any);
      return [n, handler];
    });

    onCleanup(() => {
      handlers.forEach(([e, handler]) => graphics.off(e, handler));
    });
  });

  createEffect(() => {
    for (let key in pixis) {
      (graphics as any)[key] = (pixis as any)[key];
    }
  });

  createEffect(() => {
    let cleanups: (void | (() => void))[] = [];
    if (props.use) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map((fn) => fn(graphics));
      } else {
        cleanups.push(props.use(graphics));
      }
    }

    onCleanup(() =>
      cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup())
    );
  });

  const parent = useParent();
  parent?.addChild(graphics);
  onCleanup(() => {
    parent?.removeChild(graphics);
  });

  // Add the view to the DOM
  return (
    <ParentContext.Provider value={graphics}>
      {ours.children}
    </ParentContext.Provider>
  );
}
