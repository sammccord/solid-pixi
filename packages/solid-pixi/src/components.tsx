import {
  AnimatedSprite as _AnimatedSprite,
  BitmapText as _BitmapText,
  Container as _Container,
  Culler as _Culler,
  Graphics as _Graphics,
  HTMLText as _HTMLText,
  Mesh as _Mesh,
  MeshGeometry as _MeshGeometry,
  MeshPlane as _MeshPlane,
  MeshRope as _MeshRope,
  MeshSimple as _MeshSimple,
  NineSliceGeometry as _NineSliceGeometry,
  NineSliceSprite as _NineSliceSprite,
  Particle as _Particle,
  ParticleContainer as _ParticleContainer,
  PerspectiveMesh as _PerspectiveMesh,
  PerspectivePlaneGeometry as _PerspectivePlaneGeometry,
  PlaneGeometry as _PlaneGeometry,
  RenderContainer as _RenderContainer,
  RenderLayer as _RenderLayer,
  RopeGeometry as _RopeGeometry,
  Sprite as _Sprite,
  Text as _Text,
  TilingSprite as _TilingSprite
} from 'pixi.js'
import type {
  AnimatedSpriteOptions,
  ContainerOptions,
  GraphicsOptions,
  HTMLTextOptions,
  MeshGeometryOptions,
  MeshOptions,
  MeshPlaneOptions,
  MeshRopeOptions,
  NineSliceGeometryOptions,
  NineSliceSpriteOptions,
  ParticleContainerOptions,
  ParticleOptions,
  PerspectivePlaneGeometryOptions,
  PerspectivePlaneOptions,
  PlaneGeometryOptions,
  RenderContainerOptions,
  RenderLayerOptions,
  RopeGeometryOptions,
  SimpleMeshOptions,
  Size,
  SpriteOptions,
  TextOptions,
  TilingSpriteOptions
} from 'pixi.js'
import { type Element, type Ref, omit, untrack } from 'solid-js'
import { CommonPropKeys } from './interfaces.js'
import { adopt, insert, spread } from './runtime.js'

/**
 * The constructor options of a pixi class, as props, plus what JSX adds.
 *
 * `size` is the one prop that is not a constructor option. The renderer routes
 * it through `setSize`, so width and height land in a single call.
 */
export type PixiProps<Instance, Options> = Omit<
  Partial<Options>,
  'children' | 'as' | 'ref' | 'size'
> & {
  children?: Element
  as?: Instance
  ref?: Ref<Instance>
  size?: Size
}

function createPixiComponent<Instance, Options>(Class: new (options: Options) => Instance) {
  return function PixiComponent(props: PixiProps<Instance, Options>) {
    const options = omit(props, ...CommonPropKeys)
    // A caller passes whatever subset of the options it wants, and the renderer
    // only ever handles containers. The table also carries pixi's geometries,
    // `Particle` and `Culler`, which construct here and throw once mounted.
    const node = untrack(() => {
      if (props.as) {
        adopt(props.as)
        return props.as
      }
      return new Class(options as Options)
    }) as Instance & _Container

    spread(node, options)
    insert(node, props.children)
    return node
  }
}

/** Pixi's `AnimatedSprite`, a sprite that plays through a list of textures. */
export const AnimatedSprite = /* @__PURE__ */ createPixiComponent<
  _AnimatedSprite,
  AnimatedSpriteOptions
>(_AnimatedSprite)

/** Pixi's `BitmapText`, text drawn from a preinstalled glyph atlas. */
export const BitmapText = /* @__PURE__ */ createPixiComponent<_BitmapText, TextOptions>(_BitmapText)

/** Pixi's `Container`, the grouping node every scene is built from. */
export const Container = /* @__PURE__ */ createPixiComponent<_Container, ContainerOptions>(
  _Container
)

/** Pixi's `Culler`, which skips rendering for containers outside the view. */
export const Culler = /* @__PURE__ */ createPixiComponent<_Culler, object>(_Culler)

/** Pixi's `Graphics`, a surface for vector shapes and paths. */
export const Graphics = /* @__PURE__ */ createPixiComponent<_Graphics, GraphicsOptions>(_Graphics)

/** Pixi's `HTMLText`, text laid out from HTML markup. */
export const HTMLText = /* @__PURE__ */ createPixiComponent<_HTMLText, HTMLTextOptions>(_HTMLText)

/** Pixi's `Mesh`, custom geometry drawn with a shader. */
export const Mesh = /* @__PURE__ */ createPixiComponent<_Mesh, MeshOptions>(_Mesh)

/** Pixi's `MeshGeometry`, the vertex data a mesh draws. */
export const MeshGeometry = /* @__PURE__ */ createPixiComponent<_MeshGeometry, MeshGeometryOptions>(
  _MeshGeometry
)

/** Pixi's `MeshPlane`, a subdivided plane that deforms with its vertices. */
export const MeshPlane = /* @__PURE__ */ createPixiComponent<_MeshPlane, MeshPlaneOptions>(
  _MeshPlane
)

/** Pixi's `MeshRope`, a texture bent along a series of points. */
export const MeshRope = /* @__PURE__ */ createPixiComponent<_MeshRope, MeshRopeOptions>(_MeshRope)

/** Pixi's `MeshSimple`, a mesh over raw vertex arrays. */
export const MeshSimple = /* @__PURE__ */ createPixiComponent<_MeshSimple, SimpleMeshOptions>(
  _MeshSimple
)

/** Pixi's `NineSliceGeometry`, the geometry behind nine-slice scaling. */
export const NineSliceGeometry = /* @__PURE__ */ createPixiComponent<
  _NineSliceGeometry,
  NineSliceGeometryOptions
>(_NineSliceGeometry)

/** Pixi's `NineSliceSprite`, a sprite whose corners hold their size as it resizes. */
export const NineSliceSprite = /* @__PURE__ */ createPixiComponent<
  _NineSliceSprite,
  NineSliceSpriteOptions
>(_NineSliceSprite)

/** Pixi's `Particle`, one entry in a particle container. */
export const Particle = /* @__PURE__ */ createPixiComponent<_Particle, ParticleOptions>(_Particle)

/** Pixi's `ParticleContainer`, tuned for drawing many particles at once. */
export const ParticleContainer = /* @__PURE__ */ createPixiComponent<
  _ParticleContainer,
  ParticleContainerOptions
>(_ParticleContainer)

/** Pixi's `PerspectiveMesh`, a plane with perspective-correct corners. */
export const PerspectiveMesh = /* @__PURE__ */ createPixiComponent<
  _PerspectiveMesh,
  PerspectivePlaneOptions
>(_PerspectiveMesh)

/** Pixi's `PerspectivePlaneGeometry`, the geometry behind a perspective plane. */
export const PerspectivePlaneGeometry = /* @__PURE__ */ createPixiComponent<
  _PerspectivePlaneGeometry,
  PerspectivePlaneGeometryOptions
>(_PerspectivePlaneGeometry)

/** Pixi's `PlaneGeometry`, a subdivided quad. */
export const PlaneGeometry = /* @__PURE__ */ createPixiComponent<
  _PlaneGeometry,
  PlaneGeometryOptions
>(_PlaneGeometry)

/** Pixi's `RenderContainer`, a container that draws through a callback you supply. */
export const RenderContainer = /* @__PURE__ */ createPixiComponent<
  _RenderContainer,
  RenderContainerOptions
>(_RenderContainer)

/** Pixi's `RenderLayer`, which draws its members apart from where they sit in the tree. */
export const RenderLayer = /* @__PURE__ */ createPixiComponent<
  InstanceType<typeof _RenderLayer>,
  RenderLayerOptions
>(_RenderLayer)

/** Pixi's `RopeGeometry`, the geometry behind a mesh rope. */
export const RopeGeometry = /* @__PURE__ */ createPixiComponent<_RopeGeometry, RopeGeometryOptions>(
  _RopeGeometry
)

/** Pixi's `Sprite`, a single textured quad. */
export const Sprite = /* @__PURE__ */ createPixiComponent<_Sprite, SpriteOptions>(_Sprite)

/** Pixi's `Text`, styled text rasterized to a texture. */
export const Text = /* @__PURE__ */ createPixiComponent<_Text, TextOptions>(_Text)

/** Pixi's `TilingSprite`, a texture repeated across its area. */
export const TilingSprite = /* @__PURE__ */ createPixiComponent<_TilingSprite, TilingSpriteOptions>(
  _TilingSprite
)
