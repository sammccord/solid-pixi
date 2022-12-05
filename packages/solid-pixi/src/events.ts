import { Container, DisplayObject, FederatedPointerEvent } from "pixi.js";

export interface Events {
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

export const EventTypes: (keyof Events)[] = [
  "on:added",
  "on:childRemoved",
  "on:click",
  "on:clickcapture",
  "on:destroyed",
  "on:mousedown",
  "on:mousedowncapture",
  "on:mouseenter",
  "on:mouseentercapture",
  "on:mouseleave",
  "on:mouseleavecapture",
  "on:mousemove",
  "on:mousemovecapture",
  "on:mouseout",
  "on:mouseoutcapture",
  "on:mouseover",
  "on:mouseovercapture",
  "on:mouseup",
  "on:mouseupcapture",
  "on:mouseupoutside",
  "on:mouseupoutsidecapture",
  "on:pointercancel",
  "on:pointercancelcapture",
  "on:pointerdown",
  "on:pointerdowncapture",
  "on:pointerenter",
  "on:pointerentercapture",
  "on:pointerleave",
  "on:pointerleavecapture",
  "on:pointermove",
  "on:pointermovecapture",
  "on:pointerout",
  "on:pointeroutcapture",
  "on:pointerover",
  "on:pointerovercapture",
  "on:pointertap",
  "on:pointertapcapture",
  "on:pointerup",
  "on:pointerupcapture",
  "on:pointerupoutside",
  "on:pointerupoutsidecapture",
  "on:removed",
  "on:rightclick",
  "on:rightclickcapture",
  "on:rightdown",
  "on:rightdowncapture",
  "on:rightup",
  "on:rightupcapture",
  "on:rightupoutside",
  "on:rightupoutsidecapture",
  "on:tap",
  "on:tapcapture",
  "on:touchcancel",
  "on:touchcancelcapture",
  "on:touchend",
  "on:touchendcapture",
  "on:touchendoutside",
  "on:touchendoutsidecapture",
  "on:touchmove",
  "on:touchmovecapture",
  "on:touchstart",
  "on:touchstartcapture",
  "on:wheel",
  "on:wheelcapture",
];
