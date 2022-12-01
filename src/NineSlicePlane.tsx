import {
  DisplayObjectEvents,
  NineSlicePlane as pxNineSlicePlane,
  Resource,
  Texture,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";
export interface NineSlicePlaneProps
  extends Partial<
      Omit<pxNineSlicePlane, "children" | "name" | keyof Transform>
    >,
    CommonProps<pxNineSlicePlane>,
    Transform,
    Partial<Events> {
  texture: Texture<Resource>;
}

export function NineSlicePlane(props: NineSlicePlaneProps): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes);

  let plane: pxNineSlicePlane = new pxNineSlicePlane(
    pixis.texture,
    pixis.leftWidth,
    pixis.topHeight,
    pixis.rightWidth,
    pixis.bottomHeight
  );

  if (ours.key) plane.name = ours.key;

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

  const parent = useParent();
  parent?.addChild(plane);
  onCleanup(() => {
    parent?.removeChild(plane);
  });

  // Add the view to the DOM
  return (
    <ParentContext.Provider value={plane}>
      {props.children}
    </ParentContext.Provider>
  );
}
