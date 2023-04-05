import { Assets } from 'pixi.js'
import { createEffect, createResource, onCleanup, Show, splitProps, Suspense } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { AssetPropKeys, AssetProps } from './Asset'

export function AsyncAsset<A, P>(props: AssetProps<A> & P) {
  const [texture] = createResource<A | Record<string, A>>(() =>
    Assets.load(props.urls, props.onProgress)
  )
  const [assets, others] = splitProps(props, AssetPropKeys)

  createEffect(() => {
    let cleanups: (void | (() => void))[] = []
    if (props.use && texture()) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map(fn => fn(texture() as A))
      } else {
        cleanups.push(props.use(texture() as A))
      }
    }

    onCleanup(() => cleanups.forEach(cleanup => typeof cleanup === 'function' && cleanup()))
  })

  return (
    <Suspense fallback={assets.fallback}>
      <Show when={texture()}>
        <Dynamic component={assets.component as any} texture={texture()} {...(others as P)} />
      </Show>
    </Suspense>
  )
}
