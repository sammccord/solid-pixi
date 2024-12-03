import { type MeshOptions, Mesh as pxMesh } from 'pixi-unsafe'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { EventTypes, type Events } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'

export type ExtendedMesh<Data extends object> = pxMesh & Data
export type MeshProps<Data extends object> = CommonProps<ExtendedMesh<Data>> &
  MeshOptions &
  Events &
  Data

export function Mesh<Data extends object = object>(props: MeshProps<Data>) {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)

  const mesh = (ours.as || new pxMesh(pixis)) as ExtendedMesh<Data>

  createEffect(() => {
    for (const prop in pixis) {
      ;(Mesh as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      mesh.on(event, handler)
      return () => mesh.off(event, handler)
    })

    onCleanup(() => {
      for (const cleanup of cleanups) {
        cleanup()
      }
    })
  })

  if (ours.ref) {
    createEffect(() => {
      if (typeof ours.ref === 'function') {
        const cleanup = ours.ref(mesh)
        if (cleanup as unknown) {
          onCleanup(() => (cleanup as unknown as () => void)())
        }
      } else (ours.ref as any) = mesh
    })
  }

  const parent = useParent()
  parent.addChild(mesh)
  onCleanup(() => {
    parent?.removeChild(mesh)
  })

  return <ParentContext.Provider value={mesh}>{ours.children}</ParentContext.Provider>
}
