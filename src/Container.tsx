import { Container as pxContainer, DisplayObjectEvents } from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";

export interface ContainerProps
  extends Partial<Omit<pxContainer, "children">>,
    CommonProps<pxContainer>,
    Partial<Events> {}

export function Container(props: ContainerProps): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes);
  let container = new pxContainer();

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

  createEffect(() => {
    if (props.use) {
      if (Array.isArray(props.use)) {
        props.use.forEach((fn) => fn(container));
      } else {
        props.use(container);
      }
    }
  });

  const parent = useParent();
  parent?.addChild(container);
  onCleanup(() => {
    parent?.removeChild(container);
  });

  // Add the view to the DOM
  return (
    <ParentContext.Provider value={container}>
      {ours.children}
    </ParentContext.Provider>
  );
}
