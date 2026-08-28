import { useApplication } from './Application.js'
import { insert } from './runtime.js'

export function Stage(props: { children?: unknown }) {
  const application = useApplication()

  insert(application.stage, props.children)
  return application.stage
}
