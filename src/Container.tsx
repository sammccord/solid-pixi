import {
  Container,
  Container as pxContainer,
  DisplayObjectEvents,
  IPointData,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { pixiChildren, useDiffChildren } from "./usePixiChildren";

export interface ContainerProps
  extends Partial<
      Omit<
        pxContainer,
        "children" | "transform" | "position" | "scale" | "skew" | "pivot"
      >
    >,
    Partial<Events> {
  children?: any;
  name: string;
  position?: IPointData;
  scale?: IPointData;
  skew?: IPointData;
  pivot?: IPointData;
}

export function Sprite(props: ContainerProps): JSX.Element {
  const [ours, events, pixis] = splitProps(
    props,
    ["children", "name", "position", "scale", "rotation", "skew", "pivot"],
    EventTypes
  );
  let container = new Container();

  container.name = ours.name;

  createEffect(() => {
    if (ours.position) container.position.copyFrom(ours.position);
  });

  createEffect(() => {
    if (ours.scale) container.scale.copyFrom(ours.scale);
  });

  createEffect(() => {
    if (ours.rotation) container.rotation = ours.rotation;
  });

  createEffect(() => {
    if (ours.skew) container.skew.copyFrom(ours.skew);
  });

  createEffect(() => {
    if (ours.pivot) container.pivot.copyFrom(ours.pivot);
  });

  createEffect(() => {
    const handlers: [keyof DisplayObjectEvents, any][] = Object.keys(
      events
    ).map((p) => {
      const handler = events[p as unknown as keyof Events];
      const n = p.split(":")[1] as keyof DisplayObjectEvents;
      container.on(n, handler as any);
      return [n, handler];
    });

    onCleanup(() => {
      handlers.forEach(([e, handler]) => container.off(e, handler));
    });
  });

  createEffect(() => {
    for (let key in pixis) {
      (container as any)[key] = (pixis as any)[key];
    }
  });

  const [, update] = useDiffChildren(container);
  const resolved = pixiChildren(ours.children);
  createEffect(() => {
    update(resolved());
  });

  // Add the view to the DOM
  return container as unknown as JSX.Element;
}
