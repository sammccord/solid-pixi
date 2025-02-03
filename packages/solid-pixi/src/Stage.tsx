import { JSXElement } from 'solid-js'
import { useApplication } from './Application'
import { insert } from './runtime'

export function Stage(props: { children: any }) {
  const application = useApplication()!

  insert(application.stage, () => props.children)
  return application.stage as unknown as JSXElement
}
