import {
  IParticleProperties,
  ParticleContainer as pxParticleContainer,
} from "pixi.js";
import { createEffect, JSX, splitProps } from "solid-js";
import {
  IPIXIChildren,
  pixiChildren,
  useDiffChildren,
} from "./usePixiChildren";

export interface ParticleContainerProps
  extends Partial<IParticleProperties>,
    IPIXIChildren {
  maxSize?: number;
  batchSize?: number;
  autoResize?: boolean;
}

export function ParticleContainer(props: ParticleContainerProps): JSX.Element {
  const [ours, pixis] = splitProps(props, [
    "children",
    "maxSize",
    "batchSize",
    "autoResize",
  ]);

  const particleContainer = new pxParticleContainer(
    ours.maxSize,
    pixis,
    ours.batchSize,
    ours.autoResize
  );

  const [, update] = useDiffChildren(particleContainer);
  const resolved = pixiChildren(ours.children);
  createEffect(() => {
    update(resolved());
  });

  // Add the view to the DOM
  return particleContainer as unknown as JSX.Element;
}
