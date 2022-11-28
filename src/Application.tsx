import { Application as pxApplication, IApplicationOptions } from "pixi.js";
import { createContext, createEffect, useContext } from "solid-js";
import { pixiChildren, useDiffChildren } from "./useChildren";

export const ApplicationContext = createContext<pxApplication>();

export function useApplication() {
  return useContext(ApplicationContext);
}
export interface ApplicationProps extends Partial<IApplicationOptions> {
  id?: string;
  children?: any;
}

export function Application(props: ApplicationProps) {
  const app = new pxApplication();
  // props.id = props.id || createUniqueId();
  // const [pixiApp, setPixiApp] = createSignal<pxApplication>();

  // onMount(() => {
  //   const app = new pxApplication();
  //   setPixiApp(app);
  // });

  // Create the application

  // const children = props.children
  const [, update] = useDiffChildren(app.stage);
  const resolved = pixiChildren(props.children);
  createEffect(() => {
    update(resolved());
  });

  // Add the view to the DOM
  return app.view;
}
