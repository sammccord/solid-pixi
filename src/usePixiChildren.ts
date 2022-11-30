import difference from "lodash.difference";
import { Container, DisplayObject } from "pixi.js";
import { Accessor, children, createSignal } from "solid-js";

export type PIXIChildren = DisplayObject[] | undefined;

export interface IPIXIChildren {
  children?: any;
}

export const pixiChildren = children as (
  fn: Accessor<PIXIChildren>
) => Accessor<PIXIChildren>;

export function useDiffChildren<T extends Container = Container>(
  pixiContainer: T
): [Accessor<T>, (children: PIXIChildren) => void] {
  const [container, setContainer] = createSignal<T>(pixiContainer);
  const map = new Map<string | number, DisplayObject>();

  function diffChildren(resolved: PIXIChildren) {
    if (!resolved) return;
    const updates: string[] = [];
    // If it's one child
    if (!Array.isArray(resolved)) {
      resolved = [resolved as unknown as DisplayObject];
    }
    // If it's multiple
    const childrenByName = resolved.reduce((f, c) => {
      updates.push(c.name);
      f[c.name] = c;
      return f;
    }, {} as Record<string, DisplayObject>);

    // Add/Remove children
    const existing = [...map.keys()];
    difference(updates, existing).forEach((name: string) => {
      map.set(name, childrenByName[name]!);
      setContainer((c) => {
        c.addChild(childrenByName[name]!);
        return c;
      });
    });
    difference(existing, updates).forEach((name: string) => {
      setContainer((c) => {
        c.removeChild(map.get(name)!);
        map.delete(name);
        return c;
      });
    });
  }

  return [container, diffChildren];
}
