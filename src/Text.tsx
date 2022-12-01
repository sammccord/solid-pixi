import { DisplayObjectEvents, Text as pxText } from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";
export interface TextProps
  extends Partial<Omit<pxText, "children" | keyof Transform>>,
    CommonProps<pxText>,
    Transform,
    Partial<Events> {}

export function Text(props: TextProps): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes);
  let text = new pxText(pixis.text, pixis.style, pixis.canvas);

  createEffect(() => {
    const handlers: [keyof DisplayObjectEvents, any][] = Object.keys(
      events
    ).map((p) => {
      const handler = events[p as unknown as keyof Events];
      const n = p.split(":")[1] as keyof DisplayObjectEvents;
      text.on(n, handler as any);
      return [n, handler];
    });

    onCleanup(() => {
      handlers.forEach(([e, handler]) => text.off(e, handler));
    });
  });

  createEffect(() => {
    for (let key in pixis) {
      (text as any)[key] = (pixis as any)[key];
    }
  });

  createEffect(() => {
    if (props.use) {
      if (Array.isArray(props.use)) {
        props.use.forEach((fn) => fn(text));
      } else {
        props.use(text);
      }
    }
  });

  const parent = useParent();
  parent?.addChild(text);
  onCleanup(() => {
    parent?.removeChild(text);
  });

  // Add the view to the DOM
  return (
    <ParentContext.Provider value={text}>
      {ours.children}
    </ParentContext.Provider>
  );
}
