import { type ApplicationOptions, Application as pxApplication } from 'pixi.js'
import {
  type JSXElement,
  Show,
  Suspense,
  createContext,
  createEffect,
  createResource,
  onCleanup,
  splitProps,
  useContext
} from 'solid-js'
import { ParentContext } from './ParentContext'
import { CommonPropKeys, type CommonProps } from './interfaces'

export const AppContext = createContext<pxApplication>()
export const useApplication = () => useContext(AppContext)

export type ApplicationProps = CommonProps<pxApplication> & {
  fallback?: JSXElement
} & Partial<ApplicationOptions>

export function Application(props: ApplicationProps) {
  const [ours, pixis] = splitProps(props, [...CommonPropKeys, 'fallback'])

  const [app] = createResource([pixis], async ([_pixis]) => {
    const _app = ours.as || new pxApplication()
    await _app.init(_pixis)
    return _app
  })

  createEffect(() => {
    const _app = app()
    if (!_app) return
    let cleanups: (void | (() => void))[] = []
    const uses = props.uses
    if (uses) {
      if (Array.isArray(uses)) {
        cleanups = uses.map(fn => fn(_app))
      } else {
        cleanups = [uses(_app)]
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  return (
    <Suspense fallback={ours.fallback}>
      <Show when={app()}>
        {a => {
          const _app = a()
          return (
            <AppContext.Provider value={_app}>
              <ParentContext.Provider value={_app.stage}>{ours.children}</ParentContext.Provider>
              {_app.canvas}
            </AppContext.Provider>
          )
        }}
      </Show>
    </Suspense>
  )
}
