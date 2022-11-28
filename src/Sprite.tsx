import {
  BaseTexture,
  Container,
  DisplayObject,
  FederatedPointerEvent,
  IAutoDetectOptions,
  IBaseTextureOptions,
  IPointData,
  Rectangle,
  Resource,
  Sprite as pxSprite,
  SpriteSource,
  Texture,
  Transform,
} from "pixi.js";
import { Accessor, JSX } from "solid-js";
import { useApplication } from "./Application";
import { PIXIChildren } from "./useChildren";

type TextureWithOptions = [
  texture: Texture<Resource> | BaseTexture<Resource, IAutoDetectOptions>,
  frame?: Rectangle,
  orig?: Rectangle,
  trim?: Rectangle,
  rotate?: number,
  anchor?: IPointData
];

type DirectiveAttributes = {
  [Key in keyof Directives as `use:${Key}`]?: Directives[Key];
};

interface Directives {}
interface DirectiveFunctions {
  [x: string]: (el: Element, accessor: Accessor<any>) => void;
}

export interface SpriteProps
  extends Partial<Events>,
    Partial<Omit<pxSprite, "texture" | "children">> {
  children?: PIXIChildren;
  name: string;
  texture?: TextureWithOptions;
  from?: SpriteSource;
  textureOptions?: IBaseTextureOptions<any> | undefined;
  transform?: Transform;
  interactive?: boolean;
}

interface Events {
  "on:added": (container: Container) => void;
  "on:childRemoved": (
    child: DisplayObject,
    container: Container,
    i: number
  ) => void;
  "on:click": (e: FederatedPointerEvent) => void;
  "on:clickcapture": (e: FederatedPointerEvent) => void;
  "on:destroyed": () => void;
  "on:mousedown": (e: FederatedPointerEvent) => void;
  "on:mousedowncapture": (e: FederatedPointerEvent) => void;
  "on:mouseenter": (e: FederatedPointerEvent) => void;
  "on:mouseentercapture": (e: FederatedPointerEvent) => void;
  "on:mouseleave": (e: FederatedPointerEvent) => void;
  "on:mouseleavecapture": (e: FederatedPointerEvent) => void;
  "on:mousemove": (e: FederatedPointerEvent) => void;
  "on:mousemovecapture": (e: FederatedPointerEvent) => void;
  "on:mouseout": (e: FederatedPointerEvent) => void;
  "on:mouseoutcapture": (e: FederatedPointerEvent) => void;
  "on:mouseover": (e: FederatedPointerEvent) => void;
  "on:mouseovercapture": (e: FederatedPointerEvent) => void;
  "on:mouseup": (e: FederatedPointerEvent) => void;
  "on:mouseupcapture": (e: FederatedPointerEvent) => void;
  "on:mouseupoutside": (e: FederatedPointerEvent) => void;
  "on:mouseupoutsidecapture": (e: FederatedPointerEvent) => void;
  "on:pointercancel": (e: FederatedPointerEvent) => void;
  "on:pointercancelcapture": (e: FederatedPointerEvent) => void;
  "on:pointerdown": (e: FederatedPointerEvent) => void;
  "on:pointerdowncapture": (e: FederatedPointerEvent) => void;
  "on:pointerenter": (e: FederatedPointerEvent) => void;
  "on:pointerentercapture": (e: FederatedPointerEvent) => void;
  "on:pointerleave": (e: FederatedPointerEvent) => void;
  "on:pointerleavecapture": (e: FederatedPointerEvent) => void;
  "on:pointermove": (e: FederatedPointerEvent) => void;
  "on:pointermovecapture": (e: FederatedPointerEvent) => void;
  "on:pointerout": (e: FederatedPointerEvent) => void;
  "on:pointeroutcapture": (e: FederatedPointerEvent) => void;
  "on:pointerover": (e: FederatedPointerEvent) => void;
  "on:pointerovercapture": (e: FederatedPointerEvent) => void;
  "on:pointertap": (e: FederatedPointerEvent) => void;
  "on:pointertapcapture": (e: FederatedPointerEvent) => void;
  "on:pointerup": (e: FederatedPointerEvent) => void;
  "on:pointerupcapture": (e: FederatedPointerEvent) => void;
  "on:pointerupoutside": (e: FederatedPointerEvent) => void;
  "on:pointerupoutsidecapture": (e: FederatedPointerEvent) => void;
  "on:removed": (container: Container) => void;
  "on:rightclick": (e: FederatedPointerEvent) => void;
  "on:rightclickcapture": (e: FederatedPointerEvent) => void;
  "on:rightdown": (e: FederatedPointerEvent) => void;
  "on:rightdowncapture": (e: FederatedPointerEvent) => void;
  "on:rightup": (e: FederatedPointerEvent) => void;
  "on:rightupcapture": (e: FederatedPointerEvent) => void;
  "on:rightupoutside": (e: FederatedPointerEvent) => void;
  "on:rightupoutsidecapture": (e: FederatedPointerEvent) => void;
  "on:tap": (e: FederatedPointerEvent) => void;
  "on:tapcapture": (e: FederatedPointerEvent) => void;
  "on:touchcancel": (e: FederatedPointerEvent) => void;
  "on:touchcancelcapture": (e: FederatedPointerEvent) => void;
  "on:touchend": (e: FederatedPointerEvent) => void;
  "on:touchendcapture": (e: FederatedPointerEvent) => void;
  "on:touchendoutside": (e: FederatedPointerEvent) => void;
  "on:touchendoutsidecapture": (e: FederatedPointerEvent) => void;
  "on:touchmove": (e: FederatedPointerEvent) => void;
  "on:touchmovecapture": (e: FederatedPointerEvent) => void;
  "on:touchstart": (e: FederatedPointerEvent) => void;
  "on:touchstartcapture": (e: FederatedPointerEvent) => void;
  "on:wheel": (e: FederatedPointerEvent) => void;
  "on:wheelcapture": (e: FederatedPointerEvent) => void;
}

export function Sprite(props: SpriteProps): JSX.Element {
  console.log("!!! creating", props);
  let sprite: pxSprite;

  if (!props.from && !props.texture) {
    sprite = new pxSprite(Texture.EMPTY);
  } else {
    sprite =
      props.texture && props.texture[0] instanceof Texture
        ? new pxSprite(props.texture[0])
        : pxSprite.from(props.from!, props.textureOptions);
  }

  // sprite.name = props.name

  // createEffect(() => {
  //   if (props.texture && props.texture[0] instanceof BaseTexture) sprite.texture = new Texture(props.texture[0], ...(props.texture.slice(1) as any))
  // })

  // createEffect(() => {
  //   if (props.transform)
  //     sprite.setTransform(
  //       props.transform.position.x,
  //       props.transform.position.y,
  //       props.transform.scale.x,
  //       props.transform.scale.y,
  //       props.transform.rotation,
  //       props.transform.skew.x,
  //       props.transform.skew.y,
  //       props.transform.pivot.x,
  //       props.transform.pivot.y
  //     )
  // })

  // createEffect(() => {
  //   if (props.interactive !== undefined) sprite.interactive = props.interactive
  // })

  // createEffect(() => {
  //   const handlers: [keyof DisplayObjectEvents, () => void][] = Object.keys(props)
  //     .filter((p) => p.startsWith('on:'))
  //     .map((p: string) => {
  //       const handler = (props as any)[p]
  //       const n = p.split(':')[1] as keyof DisplayObjectEvents
  //       sprite.on(n, handler)
  //       return [n, handler]
  //     })

  //   onCleanup(() => {
  //     handlers.forEach(([e, handler]) => sprite.off(e, handler))
  //   })
  // })

  // createEffect(() => {
  //   console.log('effected')
  //   props.use.forEach((fn) => fn(sprite))
  // })

  // const resolved = pixiChildren(() => props.children)
  // useDiffChildren(sprite, resolved())

  // Add the view to the DOM
  return sprite; // sprite as unknown as JSX.Element
}
