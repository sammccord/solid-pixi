import {
  type AssetInitOptions,
  Assets,
  type AssetsBundle,
  Spritesheet,
  type SpritesheetData,
  type Texture,
  type Ticker,
  type TickerCallback,
  type UnresolvedAsset
} from 'pixi.js'
import {
  type Accessor,
  type MemoOptions,
  type SourceAccessor,
  createEffect,
  createMemo,
  createSignal,
  flush
} from 'solid-js'
import { useApplication } from './Application.js'

type MaybeAccessor<T> = T | Accessor<T>

const access = <T,>(v: MaybeAccessor<T>): T =>
  typeof v === 'function' && !(v as () => T).length ? (v as () => T)() : (v as T)

export type TickOptions = {
  priority?: number
  enabled?: Accessor<boolean> | boolean
}

/**
 * Runs `callback` on the application's ticker for the life of the component.
 *
 * The callback runs inside `flush`, so its signal writes commit on the frame
 * that made them instead of a frame late. `priority` orders it among the
 * ticker's listeners. An `enabled` accessor attaches and detaches it as the
 * value flips; the callback detaches on cleanup either way.
 */
export function useTick(callback: TickerCallback<unknown>, options?: TickOptions): void {
  const app = useApplication()
  const tick = (ticker: Ticker) => flush(() => callback(ticker))
  const enabled = options?.enabled ?? true
  const isEnabled = typeof enabled === 'function' ? enabled : () => enabled

  createEffect(
    () => isEnabled(),
    on => {
      if (!on) return undefined
      app.ticker.add(tick, undefined, options?.priority)
      return () => app.ticker.remove(tick)
    }
  )
}

type AssetType = Texture | FontFace | string

export type AssetOptions<T> = MemoOptions<T>

/**
 * An async computation holding a pixi asset, with the loader's progress on the
 * side.
 *
 * Read `asset()` inside a `<Loading>` boundary, which renders its fallback
 * until the load settles. `asset.progress()` runs from 0 to 1 while it does.
 * Errors land in the nearest `<Errored>`. `refresh(asset)` reloads,
 * `isPending(() => asset())` reports an in-flight reload, and
 * `latest(asset)` reads an in-flight value imperatively.
 */
export type AssetAccessor<T> = SourceAccessor<T> & { progress: Accessor<number> }

function assetAccessor<T>(
  load: (report: (value: number) => void) => T | Promise<T>,
  options?: AssetOptions<T>
): AssetAccessor<T> {
  // The loader reports progress from inside the memo's own scope, which is the
  // case `ownedWrite` exists for.
  const [progress, setProgress] = createSignal(0, { ownedWrite: true })

  const asset = createMemo<T>(() => {
    setProgress(0)
    return load(setProgress)
  }, options)

  return Object.assign(asset, { progress })
}

/**
 * Runs `Assets.init` once and suspends until it settles.
 *
 * Pixi ignores a second `init`, so the options are read once and are not
 * reactive.
 */
export function useAssetInit(options: AssetInitOptions): SourceAccessor<boolean> {
  return createMemo(async () => {
    await Assets.init(options)
    return true
  })
}

type SpriteSheetConstruction<T extends SpritesheetData> = [Texture, T]

/** Loads a spritesheet, either from a URL or from a texture and its atlas data. */
export function useSpritesheet<T extends SpritesheetData>(
  source: MaybeAccessor<string | SpriteSheetConstruction<T>>,
  options?: AssetOptions<Spritesheet<T>>
): AssetAccessor<Spritesheet<T>> {
  return assetAccessor(async report => {
    const value = access(source)
    if (typeof value === 'string') return Assets.load<Spritesheet<T>>(value, report)

    const [texture, data] = value
    const sheet = new Spritesheet<T>(texture, data)
    await sheet.parse()
    report(1)
    return sheet
  }, options)
}

/** Loads one asset. */
export function useAsset<T extends AssetType = Texture>(
  source: MaybeAccessor<string | UnresolvedAsset<T>>,
  options?: AssetOptions<T>
): AssetAccessor<T> {
  return assetAccessor(report => Assets.load<T>(access(source), report), options)
}

/** Loads several assets and resolves to a record keyed by alias. */
export function useAssets<T extends Record<string, AssetType> = Record<string, AssetType>>(
  sources: MaybeAccessor<(string | UnresolvedAsset)[]>,
  options?: AssetOptions<T>
): AssetAccessor<T> {
  return assetAccessor(
    report => Assets.load(access(sources) as string[], report) as Promise<T>,
    options
  )
}

/** Loads a bundle, registering it first when its manifest is passed in. */
export function useBundle<T extends Record<string, AssetType> = Record<string, AssetType>>(
  bundleId: MaybeAccessor<string>,
  bundle?: MaybeAccessor<AssetsBundle['assets']>,
  options?: AssetOptions<T>
): AssetAccessor<T> {
  return assetAccessor(async report => {
    const id = access(bundleId)
    const manifest = bundle && access(bundle)
    if (manifest) Assets.addBundle(id, manifest)
    return (await Assets.loadBundle(id, report)) as T
  }, options)
}
