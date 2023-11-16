import { AssetInitOptions, Assets as pxAssets } from 'pixi.js'
import { JSX, Show, createResource, splitProps } from 'solid-js'
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

export function Assets(props: AssetsProps) {
  const [ours, pixis] = splitProps(props, ['children', 'fallback'])
  const [loaders] = createResource([pixis], ([_pixis]) => {
    const promises: Promise<any>[] = []
    if (_pixis.init) {
      promises.push(pxAssets.init(_pixis.init))
    } else {
      if (_pixis.add) pxAssets.add(..._pixis.add)
      if (_pixis.addBundle) pxAssets.addBundle(..._pixis.addBundle)
      if (_pixis.addBundles) _pixis.addBundles.forEach(bundle => pxAssets.addBundle(...bundle))
      if (_pixis.load) promises.push(pxAssets.load(..._pixis.load))
      if (_pixis.loadBundle) promises.push(pxAssets.loadBundle(..._pixis.loadBundle))
      if (_pixis.backgroundLoad) promises.push(pxAssets.backgroundLoad(..._pixis.backgroundLoad))
      if (_pixis.backgroundLoadBundle)
        promises.push(pxAssets.backgroundLoadBundle(..._pixis.backgroundLoadBundle))
    }
    return Promise.all(promises)
  })

  return (
    <Show when={loaders()} fallback={ours.fallback}>
      {ours.children}
    </Show>
  )
}
