import {
  DisplayObjectEvents,
  Geometry,
  Mesh as pxMesh,
  MeshMaterial,
} from "pixi.js";
import { createEffect, JSX, onCleanup, splitProps } from "solid-js";
import { Events, EventTypes } from "./events";
import { CommonPropKeys, CommonProps, Transform } from "./interfaces";
import { ParentContext, useParent } from "./ParentContext";
export interface MeshProps
  extends Partial<Omit<pxMesh, "children" | "name" | keyof Transform>>,
    CommonProps<pxMesh>,
    Transform,
    Partial<Events> {
  geometry: Geometry;
  shader: MeshMaterial;
}

export function Mesh(props: MeshProps): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes);

  let mesh: pxMesh = new pxMesh(
    pixis.geometry,
    pixis.material || pixis.shader,
    pixis.state,
    pixis.drawMode
  );

  if (ours.key) mesh.name = ours.key;

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

  createEffect(() => {
    if (props.use) {
      if (Array.isArray(props.use)) {
        props.use.forEach((fn) => fn(mesh));
      } else {
        props.use(mesh);
      }
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
      {props.children}
    </ParentContext.Provider>
  );
}
