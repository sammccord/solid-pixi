/// <reference types="vite/client" />
import * as pixi from 'pixi.js'
import { type Ref, createMemo, splitProps } from 'solid-js'
import { CommonPropKeys } from './interfaces'
import { insert, spread } from './runtime'

type PixiGeneric<P, O> = new (
  ...args: any[]
) => Omit<Partial<O>, 'children'> & { children?: any; as?: P; ref?: Ref<P> }

export type P = {
  /** A wrapper type for Pixi's AnimatedSprite class, allowing dynamic sprite animations */
  AnimatedSprite: PixiGeneric<pixi.AnimatedSprite, pixi.AnimatedSpriteOptions>
  /** A wrapper type for Pixi's BitmapText class, enabling bitmap-based text rendering */
  BitmapText: PixiGeneric<pixi.TextOptions, pixi.TextOptions>
  /** A wrapper type for Pixi's Container class, used for grouping display objects */
  Container: PixiGeneric<pixi.Container, pixi.ContainerOptions>
  /** A wrapper type for Pixi's Culler class, handling object culling and optimization */
  Culler: PixiGeneric<pixi.Culler, pixi.Culler>
  /** A wrapper type for Pixi's Graphics class, used for rendering primitive shapes */
  Graphics: PixiGeneric<pixi.Graphics, pixi.GraphicsOptions>
  /** A wrapper type for Pixi's HTMLText class, rendering HTML formatted text */
  HTMLText: PixiGeneric<pixi.HTMLText, pixi.HTMLTextOptions>
  /** A wrapper type for Pixi's Mesh class, handling mesh-based rendering */
  Mesh: PixiGeneric<pixi.Mesh, pixi.MeshOptions>
  /** A wrapper type for Pixi's MeshGeometry class, defining mesh geometry data */
  MeshGeometry: PixiGeneric<pixi.MeshGeometry, pixi.MeshGeometryOptions>
  /** A wrapper type for Pixi's MeshPlane class, for plane mesh rendering */
  MeshPlane: PixiGeneric<pixi.MeshPlane, pixi.MeshPlaneOptions>
  /** A wrapper type for Pixi's MeshRope class, for rope-like mesh effects */
  MeshRope: PixiGeneric<pixi.MeshRope, pixi.MeshRopeOptions>
  /** A wrapper type for Pixi's MeshSimple class, providing basic mesh functionality */
  MeshSimple: PixiGeneric<pixi.MeshSimple, pixi.SimpleMeshOptions>
  /** A wrapper type for Pixi's NineSliceGeometry class, for nine-slice scaling geometry */
  NineSliceGeometry: PixiGeneric<pixi.NineSliceGeometry, pixi.NineSliceGeometryOptions>
  /** A wrapper type for Pixi's NineSliceSprite class, enabling nine-slice scaling sprites */
  NineSliceSprite: PixiGeneric<pixi.NineSliceSprite, pixi.NineSliceSpriteOptions>
  /** A wrapper type for Pixi's Particle class, managing individual particle properties */
  Particle: PixiGeneric<pixi.Particle, pixi.ParticleOptions>
  /** A wrapper type for Pixi's ParticleContainer class, optimized for particle systems */
  ParticleContainer: PixiGeneric<pixi.ParticleContainer, pixi.ParticleContainerOptions>
  /** A wrapper type for Pixi's PerspectiveMesh class, handling perspective transformations */
  PerspectiveMesh: PixiGeneric<pixi.PerspectiveMesh, pixi.PerspectivePlaneOptions>
  /** A wrapper type for Pixi's PerspectivePlaneGeometry class, defining perspective plane geometry */
  PerspectivePlaneGeometry: PixiGeneric<
    pixi.PerspectivePlaneGeometry,
    pixi.PerspectivePlaneGeometry
  >
  /** A wrapper type for Pixi's PlaneGeometry class, defining standard plane geometry */
  PlaneGeometry: PixiGeneric<pixi.PlaneGeometry, pixi.PlaneGeometryOptions>
  /** A wrapper type for Pixi's RenderContainer class, managing render objects */
  RenderContainer: PixiGeneric<pixi.RenderContainer, pixi.RenderContainerOptions>
  /** A wrapper type for Pixi's RenderLayer class, handling render layers */
  RenderLayer: PixiGeneric<pixi.RenderLayerClass, pixi.RenderLayerOptions>
  /** A wrapper type for Pixi's RopeGeometry class, defining rope-based geometry */
  RopeGeometry: PixiGeneric<pixi.RopeGeometry, pixi.RopeGeometryOptions>
  /** A wrapper type for Pixi's Sprite class, handling basic sprite rendering */
  Sprite: PixiGeneric<pixi.Sprite, pixi.SpriteOptions>
  /** A wrapper type for Pixi's Text class, rendering basic text */
  Text: PixiGeneric<pixi.Text, pixi.TextOptions>
  /** A wrapper type for Pixi's TilingSprite class, creating repeating sprite patterns */
  TilingSprite: PixiGeneric<pixi.TilingSprite, pixi.TilingSpriteOptions>
}

// any-fying this as the definitions should take care of this
export const P = new Proxy<P>({} as any, {
  get(_target, name: string) {
    return function (props: any) {
      const [common, pixis] = splitProps(props, CommonPropKeys)

      const as = common.as || new (pixi as any)[name](pixis)
      spread(as, pixis)
      insert(as, () => common.children)
      return as
    }
  }
})
