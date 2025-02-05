import { Assets, Spritesheet, Texture, UnresolvedAsset } from 'pixi-unsafe'
import { Accessor, Resource, ResourceActions, createResource, createSignal } from 'solid-js'

type MaybeAccessor<T> = T | Accessor<T>

type MaybeAccessorValue<T extends MaybeAccessor<any>> = T extends () => any ? ReturnType<T> : T

const access = <T extends MaybeAccessor<any>>(v: T): MaybeAccessorValue<T> =>
  typeof v === 'function' && !v.length ? v() : v

type AssetType = Texture | Spritesheet | FontFace | string

/**
 * Hook to load a single asset
 * @template T
 * @param {MaybeAccessor<string | UnresolvedAsset<T>>} source - The source of the asset to load
 * @returns {[Resource<T>, ResourceActions<T | undefined, string | UnresolvedAsset> & { progress: Accessor<number> }]} A tuple containing the loaded asset resource and actions
 */
export function useAsset<T extends AssetType = Texture>(
  source: MaybeAccessor<string | UnresolvedAsset<T>>
): [
  asset: Resource<T>,
  actions: ResourceActions<T | undefined, string | UnresolvedAsset> & {
    progress: Accessor<number>
  }
] {
  const [progress, setProgress] = createSignal(0)

  const name = () => {
    const s = access(source)
    return typeof s === 'string' ? s : s.name || s.alias || s.url || s.name
  }

  const [resource, resourceActions] = createResource<
    T,
    string | UnresolvedAsset<T>,
    string | UnresolvedAsset<T>
  >(
    source,
    async urlOrAsset => {
      setProgress(0)
      const asset = await Assets.load<T>(urlOrAsset, progressValue => {
        setProgress(progressValue)
      })
      return asset
    },
    {
      name: name()
    }
  )

  return [
    resource,
    {
      mutate: resourceActions.mutate,
      refetch: resourceActions.refetch,
      progress: progress
    }
  ] as const
}

/**
 * Hook to load multiple assets
 * @template T
 * @param {MaybeAccessor<(string | UnresolvedAsset<T>)[]>} sources - An array of asset sources to load
 * @returns {[Resource<Record<string, T>>, ResourceActions<Record<string, T> | undefined, (string | UnresolvedAsset<T>)[]> & { progress: Accessor<number> }]} A tuple containing the loaded assets resource and actions
 */
export function useAssets<T extends AssetType = Texture>(
  sources: MaybeAccessor<(string | UnresolvedAsset<T>)[]>
): [
  assets: Resource<Record<string, T>>,
  actions: ResourceActions<Record<string, T> | undefined, (string | UnresolvedAsset<T>)[]> & {
    progress: Accessor<number>
  }
] {
  const [progress, setProgress] = createSignal(0)

  const names = () => {
    const s = access(sources)
    return s.map(source =>
      typeof source === 'string' ? source : source.name || source.alias || source.url || source.name
    )
  }

  const [assets, actions] = createResource<
    Record<string, T>,
    (string | UnresolvedAsset<T>)[],
    (string | UnresolvedAsset<T>)[]
  >(
    sources,
    async s => {
      setProgress(0)
      const assets = await Assets.load<T>(s as string[], progress => {
        setProgress(progress)
      })
      return assets
    },
    {
      name: names().join(', ')
    }
  )

  return [
    assets,
    {
      mutate: actions.mutate,
      refetch: actions.refetch,
      progress: progress
    }
  ] as const
}
