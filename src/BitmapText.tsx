import { BitmapText as pxBitmapText, DisplayObjectEvents } from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { Transform, Uses } from "./interfaces";
import { pixiChildren, useDiffChildren } from "./usePixiChildren";
export interface BitmapTextProps
  extends Partial<Omit<pxBitmapText, "texture" | "children" | keyof Transform>>,
    Transform,
    Partial<Events> {
  children?: any;
  name: string;
  use?: Uses<pxBitmapText>;
  text: string;
}

export function BitmapText(props: BitmapTextProps): JSX.Element {
  const [ours, events, pixis] = splitProps(
    props,
    ["children", "name", "use"],
    EventTypes
  );
  let text: pxBitmapText = new pxBitmapText(props.text, {
    fontName: pixis.fontName,
    fontSize: pixis.fontSize,
    align: pixis.align,
    tint: pixis.tint,
    letterSpacing: pixis.letterSpacing,
    maxWidth: pixis.maxWidth,
  });

  text.name = ours.name;

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

  const [, update] = useDiffChildren(text);
  const resolved = pixiChildren(ours.children);
  createEffect(() => {
    update(resolved());
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

  // Add the view to the DOM
  return text as unknown as JSX.Element;
}
