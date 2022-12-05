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

// export interface MeshProps
//   extends Partial<Omit<pxMesh, "children" | keyof Transform>>,
//     CommonProps<pxMesh>,
//     Transform,
//     Partial<Events> {
//   geometry: Geometry;
//   shader: MeshMaterial;
// }

export type ExtendedMesh<T extends Record<string, any>> = pxMesh & T;
export type MeshProps<T extends Record<string, any>> = Partial<
  Omit<pxMesh, "children" | "geometry" | "shader" | keyof Transform>
> &
  T &
  CommonProps<ExtendedMesh<T>> &
  Transform &
  Partial<Events> & {
    geometry: Geometry;
    shader: MeshMaterial;
  };

export function Mesh<T extends Record<string, any>>(
  props: MeshProps<T>
): JSX.Element {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes);

  let mesh = new pxMesh(
    pixis.geometry,
    pixis.material || pixis.shader,
    pixis.state,
    pixis.drawMode
  ) as any as ExtendedMesh<T>;

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
    let cleanups: (void | (() => void))[] = [];
    if (props.use) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map((fn) => fn(mesh));
      } else {
        cleanups.push(props.use(mesh));
      }
    }

    onCleanup(() =>
      cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup())
    );
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
