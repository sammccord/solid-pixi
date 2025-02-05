import { type ApplicationOptions, Application as PixiApplication } from 'pixi.js'
import {
  type JSXElement,
  Show,
  Suspense,
  createContext,
  createResource,
  splitProps,
  useContext
} from 'solid-js'
import { CommonPropKeys, type CommonProps } from './interfaces'
import { effect } from './runtime'

export const AppContext = createContext<PixiApplication>()
export const useApplication = () => useContext(AppContext)

export type ApplicationProps = CommonProps<PixiApplication> & {
  fallback?: JSXElement
} & Partial<ApplicationOptions>

const ApplicationPropKeys = [...CommonPropKeys, 'fallback'] as const

export const Application = (props: ApplicationProps) => {
  const [common, pixis] = splitProps(props, ApplicationPropKeys)

  const [app] = createResource(
    () => (common.as || new PixiApplication()) as PixiApplication,
    async app => {
      await app.init(pixis)
      return app
    }
  )

  effect(() => {
    if (app()) common.ref?.(app()!)
  })

  return (
    <Suspense fallback={common.fallback}>
      <Show when={app()} fallback={common.fallback}>
        <AppContext.Provider value={app()}>{props.children}</AppContext.Provider>
      </Show>
    </Suspense>
  )
}
