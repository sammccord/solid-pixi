import { type MeshOptions, Texture, MeshSimple as pxMeshSimple } from 'pixi.js'
import { createEffect, onCleanup, splitProps } from 'solid-js'
import { ParentContext, useParent } from './ParentContext'
import { EventTypes, type Events } from './events'
import { CommonPropKeys, type CommonProps } from './interfaces'

export type ExtendedMeshSimple<Data extends object> = pxMeshSimple & Data
export type MeshSimpleProps<Data extends object> = CommonProps<ExtendedMeshSimple<Data>> &
  MeshOptions &
  Events &
  Data & {
    texture: Texture
  }

export function MeshSimple<Data extends object = object>(props: MeshSimpleProps<Data>) {
  const [ours, events, pixis] = splitProps(props, CommonPropKeys, EventTypes)

  const meshSimple = (ours.as || new pxMeshSimple(pixis)) as ExtendedMeshSimple<Data>

  createEffect(() => {
    for (const prop in pixis) {
      ;(meshSimple as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      meshSimple.addEventListener(event, handler)
      return () => meshSimple.removeEventListener(event, handler)
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
        const cleanup = ours.ref(meshSimple)
        if (cleanup as unknown) {
          onCleanup(() => (cleanup as unknown as () => void)())
        }
      } else (ours.ref as any) = meshSimple
    })
  }

  const parent = useParent()
  parent.addChild(meshSimple)
  onCleanup(() => {
    parent?.removeChild(meshSimple as any)
  })

  return <ParentContext.Provider value={meshSimple}>{ours.children}</ParentContext.Provider>
}
