import {
  DisplayObjectEvents,
  Graphics as pxGraphics,
  GraphicsGeometry,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";
export interface GraphicsProps
  extends Partial<Omit<pxGraphics, "children" | keyof Transform>>,
    CommonProps<pxGraphics>,
    Transform,
    Partial<Events> {
  geometry?: GraphicsGeometry;
}

export function Graphics(props: GraphicsProps): JSX.Element {
  const [ours, events, pixis] = splitProps(
    props,
    [...CommonPropKeys, "geometry"],
    EventTypes
  );
  let graphics: pxGraphics = new pxGraphics(ours.geometry);

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
    if (props.use) {
      if (Array.isArray(props.use)) {
        props.use.forEach((fn) => fn(graphics));
      } else {
        props.use(graphics);
      }
    }
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
