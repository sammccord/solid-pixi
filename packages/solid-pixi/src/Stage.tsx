import { useApplication } from './Application'
import { insert } from './runtime'

export function Stage(props: { children?: unknown }) {
  const application = useApplication()

  insert(application.stage, () => props.children)
  return application.stage
}
