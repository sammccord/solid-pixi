import { ApplicationOptions, Application as pxApplication } from 'pixi.js'
import {
  JSXElement,
  Show,
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

  onCleanup(() => {
    app()?.destroy() // ?
  })

  return (
    <Show when={app()} fallback={ours.fallback}>
      <AppContext.Provider value={app()}>
        <ParentContext.Provider value={app()!.stage}>{ours.children}</ParentContext.Provider>
        {app()!.canvas}
      </AppContext.Provider>
    </Show>
  )
}
