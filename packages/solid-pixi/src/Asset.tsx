import { Assets, LoadAsset, ProgressCallback, Texture } from "pixi.js";
import { createEffect, createSignal, JSX, Show } from "solid-js";
import { CommonProps } from "./interfaces";

export interface AssetProps extends CommonProps<Texture> {
  urls: string | string[] | LoadAsset<any> | LoadAsset<any>[];
  onProgress?: ProgressCallback | undefined;
  fallback?: JSX.Element;
  children: JSX.Element | ((texture: Texture) => JSX.Element);
}

export function Asset(props: AssetProps) {
  const [texture, setTexture] = createSignal<Texture>();

  createEffect(() => {
    Assets.load(props.urls, props.onProgress).then(setTexture);
  });

  return (
    <Show when={texture()} fallback={props.fallback}>
      {typeof props.children === "function"
        ? props.children(texture()!)
        : props.children}
    </Show>
  );
}
