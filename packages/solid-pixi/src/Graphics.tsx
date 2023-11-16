import { Graphics as pxGraphics, GraphicsOptions } from 'pixi.js'
import { createEffect, onCleanup, splitProps, untrack } from 'solid-js'
import { Events, EventTypes } from './events'
import { CommonPropKeys, CommonProps } from './interfaces'
import { ParentContext, useParent } from './ParentContext'

export type DrawCall =
  | ['fill', ...Parameters<pxGraphics['fill']>]
  | ['stroke', ...Parameters<pxGraphics['stroke']>]
  | ['texture', ...Parameters<pxGraphics['texture']>]
  | ['beginPath', ...Parameters<pxGraphics['beginPath']>]
  | ['cut', ...Parameters<pxGraphics['cut']>]
  | ['arc', ...Parameters<pxGraphics['arc']>]
  | ['arcTo', ...Parameters<pxGraphics['arcTo']>]
  | ['arcToSvg', ...Parameters<pxGraphics['arcToSvg']>]
  | ['bezierCurveTo', ...Parameters<pxGraphics['bezierCurveTo']>]
  | ['closePath', ...Parameters<pxGraphics['closePath']>]
  | ['ellipse', ...Parameters<pxGraphics['ellipse']>]
  | ['circle', ...Parameters<pxGraphics['circle']>]
  | ['path', ...Parameters<pxGraphics['path']>]
  | ['lineTo', ...Parameters<pxGraphics['lineTo']>]
  | ['moveTo', ...Parameters<pxGraphics['moveTo']>]
  | ['quadraticCurveTo', ...Parameters<pxGraphics['quadraticCurveTo']>]
  | ['rect', ...Parameters<pxGraphics['rect']>]
  | ['roundRect', ...Parameters<pxGraphics['roundRect']>]
  | ['poly', ...Parameters<pxGraphics['poly']>]
  | ['star', ...Parameters<pxGraphics['star']>]
  | ['svg', ...Parameters<pxGraphics['svg']>]
  | ['restore', ...Parameters<pxGraphics['restore']>]
  | ['save', ...Parameters<pxGraphics['save']>]
  | ['getTransform', ...Parameters<pxGraphics['getTransform']>]
  | ['resetTransform', ...Parameters<pxGraphics['resetTransform']>]
  | ['rotateTransform', ...Parameters<pxGraphics['rotateTransform']>]
  | ['scaleTransform', ...Parameters<pxGraphics['scaleTransform']>]
  | ['setTransform', ...Parameters<pxGraphics['setTransform']>]
  | ['transform', ...Parameters<pxGraphics['transform']>]
  | ['translateTransform', ...Parameters<pxGraphics['translateTransform']>]
  | ['clear', ...Parameters<pxGraphics['clear']>]
  | ['beginFill', ...Parameters<pxGraphics['beginFill']>]
  | ['endFill', ...Parameters<pxGraphics['endFill']>]
  | ['drawCircle', ...Parameters<pxGraphics['drawCircle']>]
  | ['drawEllipse', ...Parameters<pxGraphics['drawEllipse']>]
  | ['drawPolygon', ...Parameters<pxGraphics['drawPolygon']>]
  | ['drawRect', ...Parameters<pxGraphics['drawRect']>]
  | ['drawRoundedRect', ...Parameters<pxGraphics['drawRoundedRect']>]
  | ['drawStar', ...Parameters<pxGraphics['drawStar']>]

export type DrawCalls = Array<DrawCall>
export type ExtendedGraphics<Data extends object> = pxGraphics & Data
export type GraphicsProps<Data extends object> = CommonProps<ExtendedGraphics<Data>> &
  Omit<GraphicsOptions, 'children'> &
  Events & {
    draw?: DrawCalls
  }

export function Graphics<Data extends object = object>(props: GraphicsProps<Data>) {
  let graphics: ExtendedGraphics<Data>
  const [ours, draw, events, pixis] = splitProps(props, CommonPropKeys, ['draw'], EventTypes)

  if (ours.as) {
    graphics = ours.as
  } else {
    graphics = new pxGraphics(pixis) as ExtendedGraphics<Data>
  }

  createEffect(() => {
    for (const prop in pixis) {
      ;(graphics as any)[prop] = (pixis as any)[prop]
    }
  })

  createEffect(() => {
    if (draw.draw) {
      draw.draw.forEach(([method, ...args]) => {
        untrack(() => (graphics[method] as any).bind(graphics)(...args))
      })
    }
  })

  createEffect(() => {
    const cleanups = Object.entries(events).map(([event, handler]: [any, any]) => {
      graphics.on(event, handler)
      return () => graphics.off(event, handler)
    })

    onCleanup(() => {
      for (const cleanup of cleanups) {
        cleanup()
      }
    })
  })

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    const uses = props.uses
    if (uses) {
      if (Array.isArray(uses)) {
        cleanups = untrack(() => uses.map(fn => fn(graphics)))
      } else {
        cleanups = untrack(() => [uses(graphics)])
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  const parent = useParent()
  parent.addChild(graphics)
  onCleanup(() => {
    parent.removeChild(graphics)
    graphics.destroy()
  })

  return null
}
