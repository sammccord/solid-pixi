import {
  DisplayObjectEvents,
  IParticleProperties,
  ParticleContainer as pxParticleContainer,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";

export type ExtendedParticleContainer<T extends Record<string, any>> =
  pxParticleContainer & T;
export type ParticleContainerProps<T extends Record<string, any>> = Partial<
  Omit<pxParticleContainer, "children" | keyof Transform>
> &
  T &
  CommonProps<ExtendedParticleContainer<T>> &
  Transform &
  Partial<Events> & {
    maxSize?: number;
    batchSize?: number;
    properties?: IParticleProperties;
  };

export function ParticleContainer<T extends Record<string, any>>(
  props: ParticleContainerProps<T>
): JSX.Element {
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
  ) as ExtendedParticleContainer<T>;

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
    let cleanups: (void | (() => void))[] = [];
    if (props.use) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map((fn) => fn(particleContainer));
      } else {
        cleanups.push(props.use(particleContainer));
      }
    }

    onCleanup(() =>
      cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup())
    );
  });

  const parent = useParent();
  parent?.addChild(particleContainer);
  onCleanup(() => {
    parent?.removeChild(particleContainer);
  });

  // Add the view to the DOM
  return (
    <ParentContext.Provider value={particleContainer}>
      {ours.children}
    </ParentContext.Provider>
  );
}
