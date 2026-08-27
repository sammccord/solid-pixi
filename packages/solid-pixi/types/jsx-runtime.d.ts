import type { Container } from 'pixi.js'
import type { Element as SolidElement } from 'solid-js'

export namespace JSX {
  type Element = SolidElement | Container | ArrayElement
  interface ArrayElement extends Array<Element> {}

  interface ElementChildrenAttribute {
    children: {}
  }

  /**
   * Empty on purpose. A solid-pixi tree is built from the `P.*` components,
   * which carry the pixi constructor options as their prop types. There are no
   * intrinsic tags to spell.
   */
  interface IntrinsicElements {}
}
