import { type MeshPlaneOptions, MeshPlane as pxMeshPlane } from 'pixi.js'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { EventTypes, type Events } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'

export type ExtendedMeshPlane<Data extends object> = pxMeshPlane & Data
export type MeshPlaneProps<Data extends object> = CommonProps<ExtendedMeshPlane<Data>> &
  MeshPlaneOptions &
  Events &
  Data

export function MeshPlane<Data extends object = object>(props: MeshPlaneProps<Data>) {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)

  const meshPlane = (ours.as || new pxMeshPlane(pixis)) as ExtendedMeshPlane<Data>

  createEffect(() => {
    for (const prop in pixis) {
      ;(meshPlane as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      meshPlane.on(event, handler)
      return () => meshPlane.off(event, handler)
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
        const cleanup = ours.ref(meshPlane)
        if (cleanup as unknown) {
          onCleanup(() => (cleanup as unknown as () => void)())
        }
      } else (ours.ref as any) = meshPlane
    })
  }

  const parent = useParent()
  parent.addChild(meshPlane)
  onCleanup(() => {
    parent?.removeChild(meshPlane)
  })

  return <ParentContext.Provider value={meshPlane}>{ours.children}</ParentContext.Provider>
}
