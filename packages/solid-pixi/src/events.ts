import { Container, FederatedPointerEvent, FederatedWheelEvent } from 'pixi.js'

export interface ContainerEvents {
  added?: (container: Container) => void
  childAdded?: (child: Container, container: Container, index: number) => void
  removed?: (container: Container) => void
  childRemoved?: (child: Container, container: Container, index: number) => void
  destroyed?: () => void
}

export interface Events {
  click?: (event: FederatedPointerEvent) => void
  clickcapture?: (event: FederatedPointerEvent) => void
  mousedown?: (event: FederatedPointerEvent) => void
  mousedowncapture?: (event: FederatedPointerEvent) => void
  mouseenter?: (event: FederatedPointerEvent) => void
  mouseentercapture?: (event: FederatedPointerEvent) => void
  mouseleave?: (event: FederatedPointerEvent) => void
  mouseleavecapture?: (event: FederatedPointerEvent) => void
  mousemove?: (event: FederatedPointerEvent) => void
  mousemovecapture?: (event: FederatedPointerEvent) => void
  mouseout?: (event: FederatedPointerEvent) => void
  mouseoutcapture?: (event: FederatedPointerEvent) => void
  mouseover?: (event: FederatedPointerEvent) => void
  mouseovercapture?: (event: FederatedPointerEvent) => void
  mouseup?: (event: FederatedPointerEvent) => void
  mouseupcapture?: (event: FederatedPointerEvent) => void
  mouseupoutside?: (event: FederatedPointerEvent) => void
  mouseupoutsidecapture?: (event: FederatedPointerEvent) => void
  pointercancel?: (event: FederatedPointerEvent) => void
  pointercancelcapture?: (event: FederatedPointerEvent) => void
  pointerdown?: (event: FederatedPointerEvent) => void
  pointerdowncapture?: (event: FederatedPointerEvent) => void
  pointerenter?: (event: FederatedPointerEvent) => void
  pointerentercapture?: (event: FederatedPointerEvent) => void
  pointerleave?: (event: FederatedPointerEvent) => void
  pointerleavecapture?: (event: FederatedPointerEvent) => void
  pointermove?: (event: FederatedPointerEvent) => void
  pointermovecapture?: (event: FederatedPointerEvent) => void
  pointerout?: (event: FederatedPointerEvent) => void
  pointeroutcapture?: (event: FederatedPointerEvent) => void
  pointerover?: (event: FederatedPointerEvent) => void
  pointerovercapture?: (event: FederatedPointerEvent) => void
  pointertap?: (event: FederatedPointerEvent) => void
  pointertapcapture?: (event: FederatedPointerEvent) => void
  pointerup?: (event: FederatedPointerEvent) => void
  pointerupcapture?: (event: FederatedPointerEvent) => void
  pointerupoutside?: (event: FederatedPointerEvent) => void
  pointerupoutsidecapture?: (event: FederatedPointerEvent) => void
  rightclick?: (event: FederatedPointerEvent) => void
  rightclickcapture?: (event: FederatedPointerEvent) => void
  rightdown?: (event: FederatedPointerEvent) => void
  rightdowncapture?: (event: FederatedPointerEvent) => void
  rightup?: (event: FederatedPointerEvent) => void
  rightupcapture?: (event: FederatedPointerEvent) => void
  rightupoutside?: (event: FederatedPointerEvent) => void
  rightupoutsidecapture?: (event: FederatedPointerEvent) => void
  tap?: (event: FederatedPointerEvent) => void
  tapcapture?: (event: FederatedPointerEvent) => void
  touchcancel?: (event: FederatedPointerEvent) => void
  touchcancelcapture?: (event: FederatedPointerEvent) => void
  touchend?: (event: FederatedPointerEvent) => void
  touchendcapture?: (event: FederatedPointerEvent) => void
  touchendoutside?: (event: FederatedPointerEvent) => void
  touchendoutsidecapture?: (event: FederatedPointerEvent) => void
  touchmove?: (event: FederatedPointerEvent) => void
  touchmovecapture?: (event: FederatedPointerEvent) => void
  touchstart?: (event: FederatedPointerEvent) => void
  touchstartcapture?: (event: FederatedPointerEvent) => void
  wheel?: (event: FederatedWheelEvent) => void
  wheelcapture?: (event: FederatedWheelEvent) => void
}

export const EventTypes: Array<keyof Events> = [
  'click',
  'clickcapture',
  'mousedown',
  'mousedowncapture',
  'mouseenter',
  'mouseentercapture',
  'mouseleave',
  'mouseleavecapture',
  'mousemove',
  'mousemovecapture',
  'mouseout',
  'mouseoutcapture',
  'mouseover',
  'mouseovercapture',
  'mouseup',
  'mouseupcapture',
  'mouseupoutside',
  'mouseupoutsidecapture',
  'pointercancel',
  'pointercancelcapture',
  'pointerdown',
  'pointerdowncapture',
  'pointerenter',
  'pointerentercapture',
  'pointerleave',
  'pointerleavecapture',
  'pointermove',
  'pointermovecapture',
  'pointerout',
  'pointeroutcapture',
  'pointerover',
  'pointerovercapture',
  'pointertap',
  'pointertapcapture',
  'pointerup',
  'pointerupcapture',
  'pointerupoutside',
  'pointerupoutsidecapture',
  'rightclick',
  'rightclickcapture',
  'rightdown',
  'rightdowncapture',
  'rightup',
  'rightupcapture',
  'rightupoutside',
  'rightupoutsidecapture',
  'tap',
  'tapcapture',
  'touchcancel',
  'touchcancelcapture',
  'touchend',
  'touchendcapture',
  'touchendoutside',
  'touchendoutsidecapture',
  'touchmove',
  'touchmovecapture',
  'touchstart',
  'touchstartcapture',
  'wheel',
  'wheelcapture'
]

export const ContainerEventTypes: Array<keyof ContainerEvents> = [
  'added',
  'childAdded',
  'removed',
  'childRemoved',
  'destroyed'
]
