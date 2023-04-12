import { DisplayObjectEvents, Text as pxText } from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { useParent } from "./ParentContext";

export type ExtendedText<T extends Record<string, any>> = pxText & T;
export type TextProps<T extends Record<string, any>> = Partial<
  Omit<pxText, "children" | keyof Transform>
> &
  T &
  CommonProps<ExtendedText<T>> &
  Transform &
  Partial<Events> & {
    children: string;
  };

export function Text<T extends Record<string, any>>(
  props: TextProps<T>
): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes);
  let text = ours.as || new pxText(
    ours.children,
    pixis.style,
    pixis.canvas
  ) as ExtendedText<T>;

  createEffect(() => (text.text = ours.children));

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
    let cleanups: (void | (() => void))[] = [];
    if (props.use) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map((fn) => fn(text));
      } else {
        cleanups.push(props.use(text));
      }
    }

    onCleanup(() =>
      cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup())
    );
  });

  const parent = useParent();
  parent?.addChild(text);
  onCleanup(() => {
    parent?.removeChild(text);
  });

  return null;
}
