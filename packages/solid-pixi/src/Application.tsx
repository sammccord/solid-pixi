import { Application as pxApplication, IApplicationOptions } from 'pixi.js'
import { createContext, createEffect, onCleanup, splitProps, useContext } from 'solid-js'
import { CommonPropKeys, CommonProps } from './interfaces'
import { ParentContext } from './ParentContext'

export const AppContext = createContext<pxApplication>()
export const useApp = () => useContext(AppContext)

export interface ApplicationProps
  extends Partial<IApplicationOptions>,
    CommonProps<pxApplication> {}

export function Application(props: ApplicationProps) {
  const [ours, pixis] = splitProps(props, CommonPropKeys)

  const app = ours.as || new pxApplication(pixis)

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    if (props.use) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map(fn => fn(app))
      } else {
        cleanups.push(props.use(app))
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  return (
    <AppContext.Provider value={app}>
      <ParentContext.Provider value={app.stage}>{app && ours.children}</ParentContext.Provider>
      {app.view as any}
    </AppContext.Provider>
  )
}
