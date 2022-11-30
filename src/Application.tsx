import { Application as pxApplication, IApplicationOptions } from "pixi.js";
import {
  createContext,
  createEffect,
  JSX,
  splitProps,
  useContext,
} from "solid-js";
import { pixiChildren, useDiffChildren } from "./usePixiChildren";

export const ApplicationContext = createContext<pxApplication>();

export function useApplication() {
  return useContext(ApplicationContext);
}
export interface ApplicationProps extends Partial<IApplicationOptions> {
  children?: any;
}

export function Application(props: ApplicationProps) {
  const [ours, pixis] = splitProps(props, ["children"]);
  const app = new pxApplication(pixis);

  const [, update] = useDiffChildren(app.stage);
  const resolved = pixiChildren(ours.children);
  createEffect(() => {
    update(resolved());
  });

  return app.view as unknown as JSX.Element;
}
