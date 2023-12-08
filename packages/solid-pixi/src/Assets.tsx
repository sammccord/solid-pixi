import { AssetInitOptions, Assets as pxAssets } from 'pixi.js'
import { JSX, Show, Suspense, createMemo, createResource, splitProps } from 'solid-js'
import { CommonProps } from './interfaces'

export type AssetsLoader = {
  fallback?: JSX.Element
  init?: AssetInitOptions
  add?: Parameters<(typeof pxAssets)['add']>
  load?: Parameters<(typeof pxAssets)['load']>
  addBundle?: Parameters<(typeof pxAssets)['addBundle']>
  addBundles?: Array<Parameters<(typeof pxAssets)['addBundle']>>
  loadBundle?: Parameters<(typeof pxAssets)['loadBundle']>
  backgroundLoad?: Parameters<(typeof pxAssets)['backgroundLoad']>
  backgroundLoadBundle?: Parameters<(typeof pxAssets)['backgroundLoadBundle']>
}

export type AssetsProps = Pick<CommonProps, 'children'> & AssetsLoader

type ResourceSignals = [
  AssetInitOptions | undefined,
  Parameters<(typeof pxAssets)['add']> | undefined,
  Parameters<(typeof pxAssets)['addBundle']> | undefined,
  Array<Parameters<(typeof pxAssets)['addBundle']>> | undefined,
  Parameters<(typeof pxAssets)['load']> | undefined,
  Parameters<(typeof pxAssets)['loadBundle']> | undefined,
  Parameters<(typeof pxAssets)['backgroundLoad']> | undefined,
  Parameters<(typeof pxAssets)['backgroundLoadBundle']> | undefined
]

export function Assets(props: AssetsProps) {
  const [ours, _loaders] = splitProps(props, ['children', 'fallback'])

  const loaders = createMemo<ResourceSignals>(() => [
    _loaders.init,
    _loaders.add,
    _loaders.addBundle,
    _loaders.addBundles,
    _loaders.load,
    _loaders.loadBundle,
    _loaders.backgroundLoad,
    _loaders.backgroundLoadBundle
  ])

  const [resource] = createResource(
    loaders,
    async ([
      init,
      add,
      addBundle,
      addBundles,
      load,
      loadBundle,
      backgroundLoad,
      backgroundLoadBundle
    ]) => {
      const promises: Promise<any>[] = []
      if (init) {
        await pxAssets.init(init)
      } else {
        if (add) pxAssets.add(add)
        if (addBundle) pxAssets.addBundle(...addBundle)
        if (addBundles) addBundles.forEach(bundle => pxAssets.addBundle(...bundle))
        if (load) promises.push(pxAssets.load(...load))
        if (loadBundle) promises.push(pxAssets.loadBundle(...loadBundle))
        if (backgroundLoad) pxAssets.backgroundLoad(...backgroundLoad)
        if (backgroundLoadBundle) pxAssets.backgroundLoadBundle(...backgroundLoadBundle)
      }
      await Promise.all(promises)
    }
  )

  return (
    <Suspense fallback={ours.fallback}>
      <Show when={resource()}>{ours.children}</Show>
    </Suspense>
  )
}
