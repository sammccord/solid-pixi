import { ApplicationOptions, Renderer, Application as pxApplication } from 'pixi.js'
import {
  JSXElement,
  createContext,
  createEffect,
  createResource,
  onCleanup,
  splitProps,
  untrack,
  useContext
} from 'solid-js'
import { ParentContext } from './ParentContext'
import { CommonPropKeys, CommonProps } from './interfaces'

export const AppContext = createContext<pxApplication>()
export const useApplication = () => useContext(AppContext)

export type ApplicationProps = CommonProps<pxApplication> & {
  fallback?: JSXElement
} & Partial<ApplicationOptions>

export function Application(props: ApplicationProps) {
  const [ours, pixis] = splitProps(props, [...CommonPropKeys, 'fallback'])

  const app = ours.as || new pxApplication()
  const [state] = createResource([app, pixis], ([_app, _pixis]) =>
    (_app as pxApplication<Renderer>).init(_pixis)
  )

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    const uses = props.use
    if (uses) {
      if (Array.isArray(uses)) {
        cleanups = untrack(() => uses.map(fn => fn(app)))
      } else {
        cleanups = untrack(() => [uses(app)])
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  onCleanup(() => {
    app.destroy() // ?
  })

  return (
    <>
      {state.loading ? (
        ours.fallback || null
      ) : (
        <AppContext.Provider value={app}>
          <ParentContext.Provider value={app.stage}>{app && ours.children}</ParentContext.Provider>
          {app.canvas}
        </AppContext.Provider>
      )}
    </>
  )
}
