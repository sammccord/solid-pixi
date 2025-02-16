import {
  type AssetInitOptions,
  Assets,
  type AssetsBundle,
  Spritesheet,
  type SpritesheetData,
  Texture,
  type UnresolvedAsset
} from 'pixi.js'
import {
  type Accessor,
  type Resource,
  type ResourceActions,
  type ResourceOptions,
  createResource,
  createSignal
} from 'solid-js'

type MaybeAccessor<T> = T | Accessor<T>

type MaybeAccessorValue<T extends MaybeAccessor<any>> = T extends () => any ? ReturnType<T> : T

const access = <T extends MaybeAccessor<any>>(v: T): MaybeAccessorValue<T> =>
  typeof v === 'function' && !v?.length ? v() : v

type AssetType = Texture | FontFace | string

export function useAssetInit(
  source: MaybeAccessor<AssetInitOptions>,
  options?: ResourceOptions<any>
): Resource<boolean> {
  const name = () => {
    const s = access(source)
    return JSON.stringify(s)
  }

  const [resource] = createResource(
    source,
    async opts => {
      await Assets.init(opts)
      return true
    },
    {
      ...options,
      name: name()
    }
  )

  return resource
}

type SpriteSheetConstruction<T extends SpritesheetData> = [Texture, T]

export function useSpritesheet<T extends SpritesheetData>(
  source: MaybeAccessor<string> | MaybeAccessor<SpriteSheetConstruction<T>>,
  opts?: ResourceOptions<Spritesheet<T>>
): [
  asset: Resource<Spritesheet<T>>,
  actions: ResourceActions<Spritesheet<T> | undefined> & {
    progress: Accessor<number>
  }
] {
  const [progress, setProgress] = createSignal(0)

  const name = () => {
    const s = access(source)
    if (typeof s === 'string') return s
    const t = s.at(0) as Texture
    return t.label || String(t.uid)
  }

  const [resource, resourceActions] = createResource<
    Spritesheet<T>,
    string | SpriteSheetConstruction<T>
  >(
    source,
    async urlOrOpts => {
      setProgress(0)
      if (typeof urlOrOpts === 'string') {
        const asset = await Assets.load<Spritesheet<T>>(urlOrOpts, progressValue => {
          setProgress(progressValue)
        })
        return asset
      }
      const [texture, data] = urlOrOpts
      const sheet = new Spritesheet<T>(texture, data)
      await sheet.parse()
      setProgress(100)
      return sheet
    },
    {
      ...opts,
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
 * Hook to load a single asset
 * @template T
 * @param {MaybeAccessor<string | UnresolvedAsset<T>>} source - The source of the asset to load
 * @returns {[Resource<T>, ResourceActions<T | undefined, string | UnresolvedAsset> & { progress: Accessor<number> }]} A tuple containing the loaded asset resource and actions
 */
export function useAsset<T extends AssetType = Texture>(
  source: MaybeAccessor<string | UnresolvedAsset<T>>,
  opts?: ResourceOptions<T>
): [
  asset: Resource<T>,
  actions: ResourceActions<T | undefined, string | UnresolvedAsset> & {
    progress: Accessor<number>
  }
] {
  const [progress, setProgress] = createSignal(0)

  const name = () => {
    const s = access(source)
    return typeof s === 'string' ? s : s.name || s.alias || s.url
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
      ...opts,
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
export function useAssets<T extends Record<string, AssetType> = Record<string, AssetType>>(
  sources: MaybeAccessor<(string | UnresolvedAsset<T>)[]>,
  opts?: ResourceOptions<T>
): [
  assets: Resource<T>,
  actions: ResourceActions<T | undefined, (string | UnresolvedAsset<T>)[]> & {
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
    T,
    (string | UnresolvedAsset<T>)[],
    (string | UnresolvedAsset<T>)[]
  >(
    sources,
    async s => {
      setProgress(0)
      const assets = await Assets.load(s as string[], progress => {
        setProgress(progress)
      })
      return assets as T
    },
    {
      ...opts,
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

export function useBundle<T extends Record<string, AssetType> = any>(
  bundleId: MaybeAccessor<string>,
  bundle?: MaybeAccessor<AssetsBundle['assets']>,
  opts?: ResourceOptions<T>
): [
  asset: Resource<T>,
  actions: ResourceActions<T | undefined, string | UnresolvedAsset> & {
    progress: Accessor<number>
  }
] {
  const [progress, setProgress] = createSignal(0)

  const name = () => {
    return access(bundleId)
  }

  const [resource, resourceActions] = createResource<
    T,
    [string, AssetsBundle['assets'] | undefined]
  >(
    () => [access(bundleId), access(bundle)],
    async ([_bundleId, _bundle]) => {
      setProgress(0)
      if (_bundle) {
        Assets.addBundle(_bundleId, _bundle)
      }
      const loaded = await Assets.loadBundle(_bundleId, progressValue => {
        setProgress(progressValue)
      })
      return loaded as T
    },
    { ...opts, name: name() }
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
