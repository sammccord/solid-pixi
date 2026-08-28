import { useApplication } from './Application.js'
import { insert } from './runtime.js'

/**
 * Inserts its children into the enclosing application's stage. Renders nothing
 * itself, so a DOM host around it sees only the application's canvas.
 */
export function Stage(props: { children?: unknown }) {
  const application = useApplication()

  insert(application.stage, props.children)
  return undefined
}
