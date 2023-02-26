import { Assets, LoadAsset, ProgressCallback, Texture } from "pixi.js";
import {
  Component,
  createEffect,
  createSignal,
  JSX,
  onCleanup,
  Show,
  splitProps,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { Uses } from "./interfaces";

export interface AssetProps<T> {
  urls: string | string[] | LoadAsset<any> | LoadAsset<any>[];
  onProgress?: ProgressCallback | undefined;
  fallback?: JSX.Element;
  component: Component<any> | string | keyof JSX.IntrinsicElements;
  use?: Uses<T>;
}

const AssetPropKeys: (keyof AssetProps<any>)[] = [
  "urls",
  "onProgress",
  "fallback",
  "component",
  "use",
];

export function Asset<A, P>(props: AssetProps<A> & P) {
  const [texture, setTexture] = createSignal<A>();
  const [assets, others] = splitProps(props, AssetPropKeys);

  createEffect(() => {
    Assets.load(props.urls, props.onProgress).then(setTexture);
  });

  createEffect(() => {
    let cleanups: (void | (() => void))[] = [];
    if (props.use && texture()) {
      if (Array.isArray(props.use)) {
        cleanups = props.use.map((fn) => fn(texture() as A));
      } else {
        cleanups.push(props.use(texture() as A));
      }
    }

    onCleanup(() =>
      cleanups.forEach((cleanup) => typeof cleanup === "function" && cleanup())
    );
  });

  return (
    <Show when={texture()} fallback={assets.fallback}>
      <Dynamic
        component={assets.component as any}
        texture={texture()}
        {...(others as P)}
      />
    </Show>
  );
}
