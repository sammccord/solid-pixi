import { DisplayObjectEvents, SimpleMesh as pxSimpleMesh } from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";
export interface SimpleMeshProps
  extends Partial<Omit<pxSimpleMesh, "children" | keyof Transform>>,
    CommonProps<pxSimpleMesh>,
    Transform,
    Partial<Events> {}

export function SimpleMesh(props: SimpleMeshProps): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes);

  let mesh: pxSimpleMesh = new pxSimpleMesh(
    pixis.texture,
    pixis.vertices,
    pixis.uvs,
    pixis.indices,
    pixis.drawMode
  );

  createEffect(() => {
    const handlers: [keyof DisplayObjectEvents, any][] = Object.keys(
      events
    ).map((p) => {
      const handler = events[p as unknown as keyof Events];
      const n = p.split(":")[1] as keyof DisplayObjectEvents;
      mesh.on(n, handler as any);
      return [n, handler];
    });

    onCleanup(() => {
      handlers.forEach(([e, handler]) => mesh.off(e, handler));
    });
  });

  createEffect(() => {
    for (let key in pixis) {
      (mesh as any)[key] = (pixis as any)[key];
    }
  });

  const parent = useParent();
  parent?.addChild(mesh);
  onCleanup(() => {
    parent?.removeChild(mesh);
  });

  // Add the view to the DOM
  return (
    <ParentContext.Provider value={mesh}>
      {ours.children}
    </ParentContext.Provider>
  );
}
