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
export interface SimplePlaneProps
  extends Partial<Omit<pxSimplePlane, "children" | "name" | keyof Transform>>,
    CommonProps<pxSimplePlane>,
    Transform,
    Partial<Events> {
  texture: Texture<Resource>;
  verticesX?: number;
  verticesY?: number;
}

export function SimplePlane(props: SimplePlaneProps): JSX.Element {
  const [ours, events, pixis] = splitProps(
    props,
    [...CommonPropKeys, "verticesX", "verticesY"],
    EventTypes
  );

  let plane: pxSimplePlane = new pxSimplePlane(
    pixis.texture,
    ours.verticesX,
    ours.verticesY
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
    console.log("cleaning up");
    parent?.removeChild(plane);
  });

  return (
    <ParentContext.Provider value={plane}>
      {props.children}
    </ParentContext.Provider>
  );
}
