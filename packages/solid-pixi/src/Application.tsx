import { type ApplicationOptions, Application as PixiApplication } from 'pixi.js'
import {
  type JSXElement,
  Show,
  createContext,
  createResource,
  splitProps,
  useContext
} from 'solid-js'
import { CommonPropKeys, type CommonProps } from './interfaces'
import { effect } from './runtime'

export const AppContext = createContext<PixiApplication>()
export const useApplication = () => {
  const app = useContext(AppContext)
  if (!app) throw new Error('useApplication must be used within an Application')
  return app
}

export type ApplicationProps = CommonProps<PixiApplication> & {
  fallback?: JSXElement
} & Partial<ApplicationOptions>

const ApplicationPropKeys = [...CommonPropKeys, 'fallback'] as const

/**
 * The Application component creates a PIXI.js application instance and provides it via context.
 * This serves as the root component for PIXI applications.
 *
 * @param props.as - Optional existing PIXI.Application instance to use
 * @param props.ref - Callback to get access to the PIXI.Application instance
 * @param props.fallback - Content to show while application is initializing
 * @param props.children - Child components that will have access to the PIXI.Application context
 * @param props.ApplicationOptions - PIXI.Application options to initialize with
 */
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
    <Show when={app()} fallback={common.fallback}>
      <AppContext.Provider value={app()}>{props.children}</AppContext.Provider>
    </Show>
  )
}
