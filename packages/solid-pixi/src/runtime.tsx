import * as pixi from 'pixi.js'
import type { Element } from 'solid-js'
import { createRenderEffect } from 'solid-js'
import { createRenderer } from '@solidjs/universal'

type PixiNode = pixi.Container

const renderer = createRenderer<PixiNode>({
  createElement(tag, staticProps) {
    return new (pixi as any)[tag](staticProps)
  },
  createTextNode(value) {
    return new pixi.Text({ text: value })
  },
  replaceText(textNode, value) {
    ;(textNode as pixi.Text).text = value
  },
  setProperty(node, name, value) {
    if (name === 'size') (node as any).setSize((value as any)?.width, (value as any)?.height)
    else (node as any)[name] = value
  },
  insertNode(parent, node, anchor) {
    if (!parent) return
    if (anchor) parent.addChildAt(node, parent.children.indexOf(anchor))
    else parent.addChild(node)
  },
  isTextNode(node) {
    return node instanceof pixi.Text
  },
  removeNode(_parent, node) {
    node?.removeFromParent()
  },
  getParentNode(node) {
    return node?.parent ?? undefined
  },
  getFirstChild(node) {
    return node?.children?.[0]
  },
  getNextSibling(node) {
    const siblings = node?.parent?.children
    return siblings?.[siblings.indexOf(node) + 1]
  }
})

export const {
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  setProp,
  mergeProps,
  applyRef,
  ref
} = renderer

type Props = Record<string, any>

/**
 * Applies props to a pixi node and keeps them in sync.
 *
 * Skips `children`, which callers insert themselves, and honours `renderable`
 * as a write gate: one last pass lands after it goes false, then writes stop
 * until it goes true again.
 */
export function spread(node: PixiNode, props: Props) {
  createRenderEffect(
    () => props.ref,
    r => {
      if (r) applyRef(r, node)
    }
  )

  const applied: Props = {}
  let rendered: boolean | undefined

  createRenderEffect(
    () => {
      const renderable = props.renderable ?? true
      if (rendered === false && renderable === false) return undefined

      const changed: [string, unknown][] = []
      for (const key in props) {
        if (key === 'children' || key === 'ref') continue
        const value = props[key]
        if (value !== applied[key]) changed.push([key, value])
      }
      return { changed, renderable }
    },
    update => {
      if (!update) return
      for (const [key, value] of update.changed) {
        setProp(node, key, value, applied[key])
        applied[key] = value
      }
      rendered = update.renderable
    }
  )
}

/**
 * Renders a Solid Pixi tree.
 *
 * @param code returns the tree to render
 * @param node pixi container to mount into
 * @returns a dispose function that tears the reactive graph down
 */
export const render = renderer.render as (code: () => Element, node?: PixiNode) => () => void

export { Errored, For, Loading, Match, Repeat, Reveal, Show, Switch } from 'solid-js'
