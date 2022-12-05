import { BitmapText as pxBitmapText, DisplayObjectEvents } from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { useParent } from "./ParentContext";

export type ExtendedBitmapText<T extends Record<string, any>> = pxBitmapText &
  T;
export type BitmapTextProps<T extends Record<string, any>> = Partial<
  Omit<pxBitmapText, "children" | keyof Transform>
> &
  T &
  CommonProps<ExtendedBitmapText<T>> &
  Transform &
  Partial<Events> & {
    children: string;
  };

export function BitmapText<T extends Record<string, any>>(
  props: BitmapTextProps<T>
): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes);
  let text = new pxBitmapText(ours.children, {
    fontName: pixis.fontName,
    fontSize: pixis.fontSize,
    align: pixis.align,
    tint: pixis.tint,
    letterSpacing: pixis.letterSpacing,
    maxWidth: pixis.maxWidth,
  }) as ExtendedBitmapText<T>;

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
