import { type MeshRopeOptions, MeshRope as pxMeshRope } from 'pixi-unsafe'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { EventTypes, type Events } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'

export type ExtendedMeshRope<Data extends object> = pxMeshRope & Data
export type MeshRopeProps<Data extends object> = CommonProps<ExtendedMeshRope<Data>> &
  MeshRopeOptions &
  Events &
  Data

export function MeshRope<Data extends object = object>(props: MeshRopeProps<Data>) {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)

  const meshRope = (ours.as || new pxMeshRope(pixis)) as ExtendedMeshRope<Data>

  createEffect(() => {
    for (const prop in pixis) {
      ;(MeshRope as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      meshRope.addEventListener(event, handler)
      return () => meshRope.removeEventListener(event, handler)
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
        const cleanup = ours.ref(meshRope)
        if (cleanup as unknown) {
          onCleanup(() => (cleanup as unknown as () => void)())
        }
      } else (ours.ref as any) = meshRope
    })
  }

  const parent = useParent()
  parent.addChild(meshRope)
  onCleanup(() => {
    parent?.removeChild(meshRope)
  })

  return <ParentContext.Provider value={meshRope}>{ours.children}</ParentContext.Provider>
}
