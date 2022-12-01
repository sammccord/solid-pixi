import {
  DisplayObjectEvents,
  IParticleProperties,
  ParticleContainer as pxParticleContainer,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";

export interface ParticleContainerProps
  extends Partial<
      Omit<pxParticleContainer, "children" | "name" | keyof Transform>
    >,
    CommonProps<pxParticleContainer>,
    Transform,
    Partial<Events> {
  maxSize?: number;
  batchSize?: number;
  properties?: IParticleProperties;
}

export function ParticleContainer(props: ParticleContainerProps): JSX.Element {
  const [ours, events, pixis] = splitProps(
    props,
    [...CommonPropKeys, "maxSize", "batchSize", "properties"],
    EventTypes
  );

  const particleContainer = new pxParticleContainer(
    ours.maxSize,
    ours.properties,
    ours.batchSize,
    pixis.autoResize
  );

  if (ours.key) particleContainer.name = ours.key;

  createEffect(() => {
    if (ours.properties) particleContainer.setProperties(ours.properties);
  });

  createEffect(() => {
    const handlers: [keyof DisplayObjectEvents, any][] = Object.keys(
      events
    ).map((p) => {
      const handler = events[p as unknown as keyof Events];
      const n = p.split(":")[1] as keyof DisplayObjectEvents;
      particleContainer.on(n, handler as any);
      return [n, handler];
    });

    onCleanup(() => {
      handlers.forEach(([e, handler]) => particleContainer.off(e, handler));
    });
  });

  createEffect(() => {
    for (let key in pixis) {
      (particleContainer as any)[key] = (pixis as any)[key];
    }
  });

  createEffect(() => {
    if (props.use) {
      if (Array.isArray(props.use)) {
        props.use.forEach((fn) => fn(particleContainer));
      } else {
        props.use(particleContainer);
      }
    }
  });

  const parent = useParent();
  parent?.addChild(particleContainer);
  onCleanup(() => {
    parent?.removeChild(particleContainer);
  });

  // Add the view to the DOM
  return (
    <ParentContext.Provider value={particleContainer}>
      {props.children}
    </ParentContext.Provider>
  );
}
