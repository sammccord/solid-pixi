import * as pixi from 'pixi.js'
import { Ref, splitProps } from 'solid-js'
import { CommonPropKeys } from './interfaces'
import { insert, spread } from './runtime'

type PixiGeneric<P, O> = new (
  ...args: any[]
) => Omit<Partial<O>, 'children'> & { children?: any; as?: P; ref?: Ref<P> }

export type P = {
  AnimatedSprite: PixiGeneric<pixi.AnimatedSprite, pixi.AnimatedSpriteOptions>
  BitmapText: PixiGeneric<pixi.TextOptions, pixi.TextOptions>
  Container: PixiGeneric<pixi.Container, pixi.ContainerOptions>
  Culler: PixiGeneric<pixi.Culler, pixi.Culler>
  Graphics: PixiGeneric<pixi.Graphics, pixi.GraphicsOptions>
  HTMLText: PixiGeneric<pixi.HTMLText, pixi.HTMLTextOptions>
  Mesh: PixiGeneric<pixi.Mesh, pixi.MeshOptions>
  MeshGeometry: PixiGeneric<pixi.MeshGeometry, pixi.MeshGeometryOptions>
  MeshPlane: PixiGeneric<pixi.MeshPlane, pixi.MeshPlaneOptions>
  MeshRope: PixiGeneric<pixi.MeshRope, pixi.MeshRopeOptions>
  MeshSimple: PixiGeneric<pixi.MeshSimple, pixi.SimpleMeshOptions>
  NineSliceGeometry: PixiGeneric<pixi.NineSliceGeometry, pixi.NineSliceGeometryOptions>
  NineSliceSprite: PixiGeneric<pixi.NineSliceSprite, pixi.NineSliceSpriteOptions>
  Particle: PixiGeneric<pixi.Particle, pixi.ParticleOptions>
  ParticleContainer: PixiGeneric<pixi.ParticleContainer, pixi.ParticleContainerOptions>
  PerspectiveMesh: PixiGeneric<pixi.PerspectiveMesh, pixi.PerspectivePlaneOptions>
  PerspectivePlaneGeometry: PixiGeneric<
    pixi.PerspectivePlaneGeometry,
    pixi.PerspectivePlaneGeometry
  >
  PlaneGeometry: PixiGeneric<pixi.PlaneGeometry, pixi.PlaneGeometryOptions>
  RenderContainer: PixiGeneric<pixi.RenderContainer, pixi.RenderContainerOptions>
  RenderLayer: PixiGeneric<pixi.RenderLayerClass, pixi.RenderLayerOptions>
  RopeGeometry: PixiGeneric<pixi.RopeGeometry, pixi.RopeGeometryOptions>
  Sprite: PixiGeneric<pixi.Sprite, pixi.SpriteOptions>
  Text: PixiGeneric<pixi.Text, pixi.TextOptions>
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
