import { Text } from 'pixi-unsafe'
import { type JSX, createRenderEffect } from 'solid-js'
import { createRenderer } from 'solid-js/universal'
import { P } from './P'

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
  use,
  ...other
} = createRenderer({
  createElement(string) {
    return new (P as any)[string]()
  },
  createTextNode(value) {
    return new Text(value)
  },
  replaceText(textNode: Text, value) {
    textNode.text = value
  },
  setProperty(node, name, value, _prev) {
    if (name !== 'size') {
      node[name] = value
    } else {
      // @ts-expect-error
      node.setSize(value?.width, value?.height)
    }
  },
  insertNode(parent, node, anchor) {
    if (!parent) return
    if (anchor) {
      parent?.addChildAt?.(node, anchor?.parent.children.indexOf(anchor))
    } else {
      parent?.addChild?.(node)
    }
  },
  isTextNode(node) {
    return node?.constructor.name === 'Text'
  },
  removeNode(_, node) {
    node?.removeFromParent()
  },
  getParentNode(node) {
    return node?.parent
  },
  getFirstChild(node) {
    return node?.children?.[0]
  },
  getNextSibling(node) {
    return node?.parent?.children?.[node?.parent?.children?.indexOf(node) + 1]
  }
})

function spreadExpression(node: any, props: any = {}, prevProps: any = {}) {
  let renderable = props?.renderable ?? true
  createRenderEffect(() => props.ref?.(node))
  createRenderEffect(() => {
    // Makes sure that we render one last time before the component's `renderable` prop is set to `true`, and then
    // stops until its `renderable` prop is set to `false` again.
    if (!renderable && props.renderable === false) return
    for (const prop in props) {
      if (prop === 'children' || prop === 'ref') continue
      const value = props[prop]
      if (value === prevProps[prop]) continue
      setProp(node, prop, value, prevProps[prop])
      prevProps[prop] = value
    }

    renderable = props.renderable ?? true
  })
  return prevProps
}
export function _spread<T>(node: any, accessor: T | (() => T)) {
  if (typeof accessor === 'function') {
    createRenderEffect(current =>
      // @ts-expect-error
      spreadExpression(node, accessor(), current)
    )
  } else spreadExpression(node, accessor, undefined)
}

export const spread = _spread

// export const render = other.render as (fn: () => JSXElement, ctx: ViteHotContext) => () => void
// const hotCtxMap = new Map<ViteHotContext, Array<() => void>>()
// export const render = (code: () => JSX.Element, hotCtx?: ViteHotContext) => {
//   let disposer: () => void = () => void 0
//   createRoot(dispose => {
//     const elem = insert(null, code())
//     disposer = () => {
//       dispose()
//       elem?.destroy?.()
//     }
//     if (hotCtx) {
//       hotCtxMap.set(hotCtx, [...(hotCtxMap.get(hotCtx) ?? []), disposer])
//       hotCtx.dispose(() => {
//         hotCtxMap.get(hotCtx!)?.forEach(v => v())
//         hotCtxMap.delete(hotCtx!)
//       })
//     }
//   })

//   return disposer
// }
/**
 * Renders a Solid Pixi application
 * Handles cleanup and disposal of rendered elements.
 *
 * @param code - A function that returns a JSX element to render
 * @returns A dispose function that cleans up the rendered element
 */
export const render = other.render as (application: () => JSX.Element) => () => void
// Forward Solid control flow
export {
  ErrorBoundary,
  For,
  Index,
  Match,
  Show,
  Suspense,
  SuspenseList,
  Switch
} from 'solid-js'
