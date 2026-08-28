import { type ApplicationOptions, Application as PixiApplication } from 'pixi.js'
import {
  type Element,
  Loading,
  Show,
  createContext,
  createEffect,
  createMemo,
  latest,
  omit,
  onCleanup,
  untrack,
  useContext
} from 'solid-js'
import { CommonPropKeys, type CommonProps } from './interfaces.js'

export const AppContext = createContext<PixiApplication>()

/** Reads the enclosing `Application`. Throws when there isn't one. */
export const useApplication = (): PixiApplication => {
  try {
    return useContext(AppContext)
  } catch {
    throw new Error('useApplication must be called under <Application>')
  }
}

export type ApplicationProps = CommonProps<PixiApplication> & {
  fallback?: Element
} & Partial<ApplicationOptions>

const ApplicationPropKeys = [...CommonPropKeys, 'fallback'] as const

/**
 * Creates a PIXI.js application and provides it to its children via context.
 * This is the root component of a solid-pixi tree.
 *
 * An application left to create its own canvas renders that canvas, so a DOM
 * host mounts it wherever the component sits. A canvas handed in through
 * `props.canvas` stays where the caller put it.
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

  // `latest` reads whatever the async memo holds without suspending; a still
  // initializing application has nothing to destroy. `destroy(true)` also
  // removes the canvas.
  onCleanup(() => latest(app)?.destroy(true))

  // Show reads the pending application inside a tracking scope, so it suspends
  // to the Loading boundary. A context provider reads its value untracked, and
  // an untracked pending read is a hard error rather than a suspension.
  return (
    <Loading fallback={props.fallback}>
      <Show when={app()} keyed>
        {instance => (
          <AppContext value={instance}>
            {props.canvas ? undefined : instance.canvas}
            {props.children}
          </AppContext>
        )}
      </Show>
    </Loading>
  )
}
