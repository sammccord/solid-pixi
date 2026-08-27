import { type ApplicationOptions, Application as PixiApplication } from 'pixi.js'
import {
  type Element,
  Loading,
  createContext,
  createEffect,
  createMemo,
  omit,
  untrack,
  useContext
} from 'solid-js'
import { CommonPropKeys, type CommonProps } from './interfaces'

export const AppContext = createContext<PixiApplication>()

/** Reads the enclosing `Application`. Throws when there isn't one. */
export const useApplication = () => useContext(AppContext)

export type ApplicationProps = CommonProps<PixiApplication> & {
  fallback?: Element
} & Partial<ApplicationOptions>

const ApplicationPropKeys = [...CommonPropKeys, 'fallback'] as const

/**
 * Creates a PIXI.js application and provides it to its children via context.
 * This is the root component of a solid-pixi tree.
 *
 * @param props.as an existing PIXI.Application to adopt instead of creating one
 * @param props.ref called with the application once it has initialized
 * @param props.fallback rendered while the application is initializing
 * @param props.children components that read the application from context
 */
export const Application = (props: ApplicationProps) => {
  const options = omit(props, ...ApplicationPropKeys)

  const app = createMemo(async () => {
    const instance = props.as ?? new PixiApplication()
    await instance.init(untrack(() => ({ ...options })))
    return instance
  })

  createEffect(
    () => app(),
    instance => props.ref?.(instance)
  )

  return (
    <Loading fallback={props.fallback}>
      <AppContext value={app()}>{props.children}</AppContext>
    </Loading>
  )
}
